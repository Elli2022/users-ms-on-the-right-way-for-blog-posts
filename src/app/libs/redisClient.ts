const redis = require("redis");

const redisConfig = {
  host: "localhost",
  port: 6379,
};

const client = redis.createClient(redisConfig);

client.on("error", (err) => console.error("Redis Client Error", err));

client.connect().catch((err) => {
  console.error("Redis connect error", err);
});

module.exports = client;
