import {
  createSnippet,
  findSnippetById,
  findSnippetByOwner,
  updateSnippet,
  deleteSnippet,
  getSnippetsPublic,
} from "../repository/snippetDb";
import type { Language, Visibility } from "../db/schema";
export const createSnippetService = async (payload: {
  title: string;
  description: string;
  language: Language;
  code: string;
  visibility: Visibility;
  ownerId: string;
}) => {
  try {
    const snippet = await createSnippet(payload);
    return snippet;
  } catch (error) {
    console.error("Error creating snippet:", error);
    throw new Error("Failed to create snippet");
  }
};

export const getAllSnippetsService = async (
  ownerId: string,
  page: number,
  limit: number,
) => {
  try {
    return await findSnippetByOwner(ownerId, page, limit);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    throw new Error("Failed to fetch snippets");
  }
};

export const getAllPublicSnippetsService = async (
  ownerId: string,
  page: number,
  limit: number,
) => {
  try {
    return await getSnippetsPublic(ownerId, page, limit);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    throw new Error("Failed to fetch snippets");
  }
};

export const getSnippetByIdService = async (id: string) => {
  try {
    return await findSnippetById(id);
  } catch (error) {
    console.error("Error fetching snippet:", error);
    throw new Error("Failed to fetch snippet");
  }
};

export const updateSnippetService = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    language: Language;
    code: string;
    visibility: Visibility;
  },
) => {
  try {
    return await updateSnippet(id, payload);
  } catch (error) {
    console.error("Error updating snippet:", error);
    throw new Error("Failed to update snippet");
  }
};

export const deleteSnippetService = async (id: string) => {
  try {
    return await deleteSnippet(id);
  } catch (error) {
    console.error("Error deleting snippet:", error);
    throw new Error("Failed to delete snippet");
  }
};
