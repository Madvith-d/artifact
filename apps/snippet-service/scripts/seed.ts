import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });
import { db } from "../src/db/db";
import { snippets } from "../src/db/schema";
import crypto from "crypto";

const ALICE_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const BOB_ID = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

const seedSnippets = [
  // Alice — public snippets
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Hello World TypeScript",
    description: "A simple TypeScript hello world example",
    language: "typescript" as const,
    code: 'const greeting: string = "Hello, World!";\nconsole.log(greeting);',
    visibility: "public" as const,
    ownerId: ALICE_ID,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "Array Utilities",
    description: "Useful JavaScript array helpers",
    language: "javascript" as const,
    code: "export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];\nexport const shuffle = <T>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);",
    visibility: "public" as const,
    ownerId: ALICE_ID,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    title: "Landing Page",
    description: "A basic HTML landing page template",
    language: "html" as const,
    code: '<!DOCTYPE html>\n<html>\n<head><title>My App</title></head>\n<body>\n  <h1>Welcome</h1>\n  <p>Hello from my app!</p>\n</body>\n</html>',
    visibility: "public" as const,
    ownerId: ALICE_ID,
  },
  // Alice — private snippets
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Fibonacci in Python",
    description: "Recursive Fibonacci implementation",
    language: "python" as const,
    code: "def fib(n: int) -> int:\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)",
    visibility: "private" as const,
    ownerId: ALICE_ID,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    title: "User Query",
    description: "SQL query to fetch active users",
    language: "sql" as const,
    code: "SELECT u.id, u.username, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE u.active = true\nGROUP BY u.id\nORDER BY order_count DESC;",
    visibility: "private" as const,
    ownerId: ALICE_ID,
  },
  // Bob — public snippet
  {
    id: "66666666-6666-4666-8666-666666666666",
    title: "Deploy Script",
    description: "Bash script for zero-downtime deployment",
    language: "bash" as const,
    code: "#!/bin/bash\nset -euo pipefail\n\necho \"Building...\"\nnpm run build\necho \"Deploying...\"\nrsync -avz dist/ user@server:/app/\necho \"Done!\"",
    visibility: "public" as const,
    ownerId: BOB_ID,
  },
  // Bob — private snippet
  {
    id: "77777777-7777-4777-8777-777777777777",
    title: "Merge Sort C++",
    description: "Merge sort algorithm in C++",
    language: "c++" as const,
    code: "#include <vector>\n\nvoid merge(std::vector<int>& arr, int l, int m, int r) {\n    // merge implementation\n}",
    visibility: "private" as const,
    ownerId: BOB_ID,
  },
];

async function main() {
  console.log("Seeding snippets...");

  for (const snippet of seedSnippets) {
    console.log(`  Inserting: ${snippet.title}`);
    await db.insert(snippets).values({
      ...snippet,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoNothing();
  }

  console.log(`Seeded ${seedSnippets.length} snippets`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
