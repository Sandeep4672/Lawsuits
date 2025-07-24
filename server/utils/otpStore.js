// utils/otpStore.js
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

const otpStore = new Redis(redisUrl, {
  tls: {}, // required for Upstash (uses SSL)
});

otpStore.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default otpStore;
