//src/app/component/controller/index.ts
import { logger } from "../../libs/logger";
import { post, get, postBlog } from "../use-cases";
import config from "../../config";
const baseUrl = "/api/v1/user";

const getUsersEP = async (req, res) => {
  try {
    const results = await get({ params: req.params });
    res.json({ err: 0, data: results });
  } catch (err) {
    logger.error(`[EP][GET] ${req.method}: ${err}`);
    res.status(403);
    res.json({ err: 1, data: { err } });
  }
};

const registerUserEP = async (req, res) => {
  try {
    const results = await post({ params: req.body });
    res.status(201).json({ err: 0, data: results }); // 201 Created för en lyckad skapelse
  } catch (err) {
    logger.error(`[EP][POST] ${req.method}: ${err.message}`);
    const statusCode = err.isValidationError ? 400 : 500; // Exempel på att sätta rätt statuskod baserat på felets typ
    res.status(statusCode).json({ err: 1, data: err.message });
  }
};

const postBlogEP = async (req, res) => {
  try {
    // Logik för att hantera postning av blogginlägg
    const results = await postBlog.postBlog({
      params: req.body,
      dbConfig: config.DB_CONFIG,
    });
    res.status(201).json({ err: 0, data: results });
  } catch (err) {
    logger.error(`[EP][POSTBLOG] ${req.method}: ${err.message}`);
    res.status(500).json({ err: 1, data: err.message });
  }
};

const routes = [
  {
    path: `${baseUrl}/username/:username?/email/:email?`,
    method: "get",
    component: getUsersEP,
  },
  { path: `${baseUrl}/`, method: "post", component: registerUserEP },
  { path: `${baseUrl}/blog`, method: "post", component: postBlogEP },
];

export { routes };
