import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate";
import { verifiedRoute } from "../middlewares/verifiedRoute";
import {
  handleCreateSnippet,
  handleGetSnippetsUser,
  handleGetAllPublicSnippets,
  handleSnippetUpdate,
  handleSnippetDelete,
} from "../controllers/snippet.controller";
const router = Router();

const createSnippetSchema = z.object({
  title: z.string(),
  description: z.string(),
  language: z.string(),
  code: z.string(),
  visibility: z.string(),
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

const paginationSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

router.post("/", verifiedRoute, validate(createSnippetSchema), handleCreateSnippet);
router.get(
  "/public/:userId",
  validate(paginationSchema, "query"),
  handleGetAllPublicSnippets,
);
router.get("/", verifiedRoute, validate(paginationSchema, "query"), handleGetSnippetsUser);

router.patch("/:id", verifiedRoute, validate(updateSnippetSchema), handleSnippetUpdate);
router.delete("/:id", verifiedRoute, validate(deleteSnippetSchema), handleSnippetDelete);

export default router;
