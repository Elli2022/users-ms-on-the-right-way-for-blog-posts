// src/app/component/use-cases/post.ts
const redisClient = require("../../libs/redisClient");

export default function createPost({
  makeInputObj,
  findDocuments,
  insertDocument,
  get,
  logger,
}) {
  return Object.freeze({ post });

  async function post({ params, dbConfig, errorMsgs }) {
    logger.info("[POST][USE-CASE] Inserting object process - START!");
    const userFactory = makeInputObj({ params });

    const user = {
      username: userFactory.username(),
      password: userFactory.password(),
      email: userFactory.email(),
      role: userFactory.role(),
      usernameHash: userFactory.usernameHash(),
      emailHash: userFactory.emailHash(),
      usernamePasswordHash: userFactory.usernamePasswordHash(),
      created: userFactory.created(),
      modified: userFactory.modified(),
    };

    // Check for duplicates
    const query = { $or: [{ username: user.username }, { email: user.email }] };
    const checkDuplicate = await findDocuments({ query, dbConfig });
    if (checkDuplicate.length) {
      throw new Error(errorMsgs.EXISTING_USER);
    }

    // Insert the user document
    const savedUser = await insertDocument({ document: user, dbConfig });
    logger.info(`Användare ${savedUser.username} skapades`);

    // Cache the user in Redis
    await cacheUser(savedUser);

    // Assuming 'get' retrieves the user, adjust as necessary
    const inserted = await get({ params: { username: user.username } });
    return inserted;
  }

  async function cacheUser(user) {
    const cacheKey = `user:${user.username}`;
    try {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));
      logger.info(`User ${user.username} cached in Redis.`);
    } catch (error) {
      logger.error(`Redis error while setting cache: ${error}`);
    }
  }
}
