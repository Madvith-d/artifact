import { db } from "../db/db";
import { snippets, type Language, type Visibility } from "../db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
export const createSnippet = async (payload: {
  title: string;
  description: string;
  language: Language;
  code: string;
  visibility: Visibility;
  ownerId: string;
}) => {
  try {
    const id = crypto.randomUUID();
    const { title, description, language, code, visibility, ownerId } = payload;
    const result = await db.insert(snippets).values({
      id: id,
      title: title,
      description: description,
      language: language,
      code: code,
      visibility: visibility,
      ownerId: ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  } catch (error) {
    throw new Error("Failed to create snippet");
  }
};

export const findSnippetById = async (id: string) => {
  try {
    const snippet = await db
      .select()
      .from(snippets)
      .where(eq(snippets.id, id))
      .limit(1);
    return snippet[0];
  } catch (error) {
    throw new Error("Failed to find snippet");
  }
};

export const findSnippetByOwner = async (
  ownerId: string,
  page: number,
  limit: number,
) => {
  try {
    const offset = (page - 1) * limit;
    const snippet = await db
      .select()
      .from(snippets)
      .where(eq(snippets.ownerId, ownerId))
      .limit(limit)
      .offset(offset);
    return snippet;
  } catch (error) {
    throw new Error("Failed to find snippet");
  }
};

export const getSnippetsPublic = async (
  ownerId: string,
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const offset = (page - 1) * limit;
    const snippet = await db
      .select()
      .from(snippets)
      .where(
        and(eq(snippets.ownerId, ownerId), eq(snippets.visibility, "public")),
      )
      .limit(limit)
      .offset(offset);
    return snippet;
  } catch (error) {
    throw new Error("Failed to find snippet");
  }
};

export const updateSnippet = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    language:
      | "typescript"
      | "javascript"
      | "python"
      | "java"
      | "c++"
      | "c"
      | "html"
      | "css"
      | "sql"
      | "bash"
      | "powershell"
      | "";
    code?: string;
    visibility?: "public" | "private";
  },
) => {
  try {
    const { title, description, language, code, visibility } = payload;
    const result = await db
      .update(snippets)
      .set({
        title: title,
        description: description,
        language: language,
        code: code,
        visibility: visibility,
        updatedAt: new Date(),
      })
      .where(eq(snippets.id, id))
      .returning();
    return result[0];
  } catch (error) {
    throw new Error("Failed to update snippet");
  }
};

export const deleteSnippet = async (id: string) => {
  try {
    const result = await db.delete(snippets).where(eq(snippets.id, id)).returning();
    return result[0];
  } catch (error) {
    throw new Error("Failed to delete snippet");
  }
};
