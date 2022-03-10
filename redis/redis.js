var redis = require("redis");

// redis setup
const REDIS_PORT = process.env.REDIS_PORT || "6379";

// deployed
const client = redis.createClient({
  url: process.env.REDIS_URL || `redis://localhost:${REDIS_PORT}`,
});

// local
// const client = redis.createClient(REDIS_PORT);

(async () => {
  await client.connect();
})();

client.on("connect", () => console.log("::> Redis Client Connected"));
client.on("error", (err) => console.log("<:: Redis Client Error", err));
function closeInstance() {
  client.quit();
}

module.exports = client;
