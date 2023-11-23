//src/app/component/use-cases/postBlog.ts
import { insertBlogPost } from "../data-access";

export default function createPostBlog({ logger }) {
  return Object.freeze({ postBlog });

  async function postBlog({ params, dbConfig }) {
    logger.info("[POSTBLOG][USE-CASE] Posting a blog - START!");

    // Validera inkommande parametrar
    const validatedParams = validateBlogPost(params);
    if (!validatedParams) {
      throw new Error("Ogiltiga parametrar för blogginlägg");
    }

    // Infoga blogginlägg i databasen
    try {
      const savedPost = await insertBlogPost({
        post: validatedParams,
        dbConfig,
      });
      logger.info(`Blogginlägg skapat med ID: ${savedPost.insertedId}`);
      return savedPost;
    } catch (error) {
      logger.error(`Kunde inte skapa blogginlägg: ${error.message}`);
      throw error; // Kasta vidare felet så att det kan hanteras uppströms
    }
  }

  function validateBlogPost(params) {
    // Kontrollera att nödvändiga fält finns
    const { title, content, author } = params;
    if (!title || typeof title !== "string" || title.trim() === "") {
      throw new Error("Titel är obligatoriskt och måste vara en sträng");
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new Error("Innehåll är obligatoriskt och måste vara en sträng");
    }
    if (!author || typeof author !== "string" || author.trim() === "") {
      throw new Error("Författare är obligatoriskt och måste vara en sträng");
    }

    // Här kan du lägga till ytterligare valideringar om nödvändigt
    return { title, content, author }; // Returnera validerade parametrar
  }
}
