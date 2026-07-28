import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate";
import {
  handleCreateSnippet,
  handleGetSnippetsUser,
  handleGetAllPublicSnippets,
} from "../controllers/snippet.controller";
const router = Router();

const createSnippetSchema = z.object({
  title: z.string(),
  description: z.string(),
  language: z.string(),
  code: z.string(),
  visibility: z.string(),
  ownerId: z.string(),
});

const updateSnippetSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  language: z.string(),
  code: z.string(),
  visibility: z.string(),
});

const deleteSnippetSchema = z.object({
  id: z.string(),
});

const getPublicSnippetUserSchema = z.object({
  page: z.number(),
  limit: z.number(),
});

const getSnippetUserSchema = z.object({
  ownerId: z.string(),
  page: z.number(),
  limit: z.number(),
});

router.post("/", validate(createSnippetSchema), handleCreateSnippet);
router.get(
  "/public/:userId",
  validate(getPublicSnippetUserSchema),
  handleGetAllPublicSnippets,
);
router.get("/", validate(getSnippetUserSchema), handleGetSnippetsUser);
