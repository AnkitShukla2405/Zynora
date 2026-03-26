import { createClient } from "redis";

const client = createClient({
  url: `redis://${process.env.REDIS_HOST || "redis"}:6379`,
});

client.on("error", (err) => console.error("❌ Redis Error:", err));

export async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log("✅ Redis Connected");
  }
}

export default client;