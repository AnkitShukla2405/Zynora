import "module-alias/register";
import "dotenv/config";
import http from "http";
import { parse } from "cookie";
import { createYoga, createSchema } from "graphql-yoga";
import Stripe from "stripe";
import { getAuthenticatedUser } from "./utils/getAuthenticatedUser";
import { User } from "./model/user.model";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import dbConnect from "./lib/dbConnect";
import { typeDefs, resolvers } from "./graphql";
import { handlePaymentSuccess } from "./services/stripe/handlePaymentSucess";
import { handlePaymentFailure } from "./services/stripe/handlePaymentFailure";
import { connectRedis } from "./lib/redis";

async function startServer() {
  await dbConnect();
  await connectRedis();

  const schema = createSchema({
    typeDefs,
    resolvers,
  });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const getRawBody = (req: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const chunks = [];

      req.on("data", (chunk: any) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  };

  const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  cors: {
    origin: [
      "http://localhost:3000",
      "https://zynora-hdi6qdp9p-ankitshukla2405s-projects.vercel.app",
      "https://zynora-green.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "idempotency-key",
      "payment-idempotency-key",
    ],
  },
  plugins: [useCookies()],

    context: async (ctx) => {
      const forwardedProto =
  ctx.request.headers.get("x-forwarded-proto");

const proto =
  forwardedProto && forwardedProto.includes("https")
    ? "https"
    : "http";

console.log("PROTO:", proto);
      const { request } = ctx;

      console.log("Request:", request)
      const cookieHeader = request.headers.get("cookie") || "";
      const cookies = parse(cookieHeader);

      const token = await getAuthenticatedUser(request);

      console.log("token: ", token);

      const user = await User.findById(token?.sub);

      console.log(user);

      const guestId = cookies.guestId || null;

      return {
        ...ctx,
        request,
        user,
        guestId,
      };
    },
  });

  const server = http.createServer(async (req, res) => {

    if (req.url === "/api/webhooks/stripe" && req.method === "POST") {
      try {
        const rawBody = await getRawBody(req);

        const signature = req.headers["stripe-signature"];

        if (!signature) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing Stripe signature");
          return;
        }

        const event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret,
        );

        switch (event.type) {
          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            await handlePaymentSuccess(paymentIntent);
            break;
          }

          case "payment_intent.payment_failed":
          case "payment_intent.canceled": {
            const paymentIntent = event.data.object;
            await handlePaymentFailure(paymentIntent);
            break;
          }

          default:
            console.log("Unhandled event:", event.type);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ received: true }));
      } catch (error) {
        console.error("Webhook Error:", error.message);

        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(`Webhook Error: ${error.message}`);
      }
      return;
    }
    yoga(req, res);
  });

  server.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Backend running at http://0.0.0.0:4000/graphql");
  });
}

startServer();
