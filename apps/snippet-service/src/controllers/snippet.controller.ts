import type { Request, Response } from "express";
import {
  createSnippetService,
  getAllSnippetsService,
} from "../services/snippet.service";
export const handleCreateSnippet = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; email: string };
    const { title, description, language, code, visibility } = req.body;
    const snippet = await createSnippetService({
      title,
      description,
      language,
      code,
      visibility,
      ownerId: user.id,
    });
    return res.status(201).json({ message: "Snippet created", snippet });
  } catch (error) {
    console.error("Error creating snippet:", error);
    return res.status(500).json({ error: "Failed to create snippet" });
  }
};

export const handleGetSnippetsUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; email: string };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const snippets = await getAllSnippetsService(user.id, page, limit);
    return res.status(200).json({ message: "Snippets fetched", snippets });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return res.status(500).json({ error: "Failed to fetch snippets" });
  }
};
