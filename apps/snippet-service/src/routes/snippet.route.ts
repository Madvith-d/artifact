import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate";
import { verifiedRoute } from "../middlewares/verifiedRoute";
import { optionalAuth } from "../middlewares/optionalAuth";
import {
  handleCreateSnippet,
  handleGetSnippetsUser,
  handleGetAllPublicSnippets,
  handleGetOneSnippet,
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
  title: z.string().optional(),
  description: z.string().optional(),
  language: z.string().optional(),
  code: z.string().optional(),
  visibility: z.string().optional(),
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
router.get("/:id", optionalAuth, handleGetOneSnippet);

router.patch("/:id", verifiedRoute, validate(updateSnippetSchema), handleSnippetUpdate);
router.delete("/:id", verifiedRoute, handleSnippetDelete);

export default router;
