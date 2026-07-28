import type { Request, Response } from "express";
import {
  createSnippetService,
  getAllSnippetsService,
  getAllPublicSnippetsService,
  updateSnippetService,
  deleteSnippetService,
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

export const handleGetAllPublicSnippets = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.body.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const snippets = await getAllPublicSnippetsService(userId, page, limit);
    return res.status(200).json({ message: "Snippets fetched", snippets });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return res.status(500).json({ error: "Failed to fetch snippets" });
  }
};

export const handleSnippetUpdate = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; email: string };
    const { id, title, description, language, code, visibility } = req.body;
    const snippet = await updateSnippetService(id, {
      title,
      description,
      language,
      code,
      visibility,
    });
    return res.status(200).json({ message: "Snippet updated", snippet });
  } catch (error) {
    console.error("Error updating snippet:", error);
    return res.status(500).json({ error: "Failed to update snippet" });
  }
};

export const handleSnippetDelete = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; email: string };
    const { id } = req.body;
    const snippet = await deleteSnippetService(id);
    return res.status(200).json({ message: "Snippet deleted", snippet });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return res.status(500).json({ error: "Failed to delete snippet" });
  }
};
