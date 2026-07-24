import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

export default async function globalSetup() {
  const evidenceDirectory = path.resolve(".local-data/e2e");
  await rm(evidenceDirectory, { recursive: true, force: true });
  await mkdir(evidenceDirectory, { recursive: true });
}
