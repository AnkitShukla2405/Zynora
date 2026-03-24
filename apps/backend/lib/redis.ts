import { createClient } from "redis";


const client = createClient({
    url: `redis://${process.env.REDIS_HOST || "redis"}:6379`
});

client.on("error", (err) => console.error("❌ Redis Error:", err));


if(!client.isOpen) {
    client.connect();
}

export default client;