import type { Request, Response } from "express";
import {
  createSnippetService,
  getAllSnippetsService,
  getAllPublicSnippetsService,
  getSnippetByIdService,
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
    const userId = req.params.userId as string;
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
    const id = req.params.id as string;
    const { title, description, language, code, visibility } = req.body;
    const snippet = await updateSnippetService(id, user.id, {
      title,
      description,
      language,
      code,
      visibility,
    });
    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }
    return res.status(200).json({ message: "Snippet updated", snippet });
  } catch (error) {
    console.error("Error updating snippet:", error);
    return res.status(500).json({ error: "Failed to update snippet" });
  }
};

export const handleSnippetDelete = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; email: string };
    const id = req.params.id as string;
    const snippet = await deleteSnippetService(id, user.id);
    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }
    return res.status(200).json({ message: "Snippet deleted", snippet });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return res.status(500).json({ error: "Failed to delete snippet" });
  }
};

export const handleGetOneSnippet = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.user;
    const snippet = await getSnippetByIdService(id);

    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    if (snippet.visibility === "public") {
      return res.status(200).json({ message: "Snippet fetched", snippet });
    }

    if (snippet.visibility === "private") {
      if (user && user.id === snippet.ownerId) {
        return res.status(200).json({ message: "Snippet fetched", snippet });
      }
      return res.status(404).json({ error: "Snippet not found" });
    }

    return res.status(404).json({ error: "Snippet not found" });
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return res.status(500).json({ error: "Failed to fetch snippet" });
  }
};

