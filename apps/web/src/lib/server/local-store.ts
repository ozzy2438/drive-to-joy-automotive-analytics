import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const appendQueues = new Map<string, Promise<void>>();

export function localDataDirectory(): string {
  return process.env.DTJ_LOCAL_DATA_DIR
    ? path.resolve(process.env.DTJ_LOCAL_DATA_DIR)
    : path.join(process.cwd(), ".local-data");
}

function localFile(filename: string): string {
  if (!/^[a-z0-9-]+\.ndjson$/.test(filename)) {
    throw new Error("Invalid local data filename");
  }
  return path.join(localDataDirectory(), filename);
}

export async function appendNdjson(
  filename: string,
  record: unknown,
): Promise<void> {
  const target = localFile(filename);
  const previous = appendQueues.get(target) ?? Promise.resolve();
  const operation = previous.then(async () => {
    await mkdir(path.dirname(target), { recursive: true });
    await appendFile(target, `${JSON.stringify(record)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
  });
  appendQueues.set(target, operation.catch(() => undefined));
  await operation;
}

export async function readNdjson<T>(filename: string): Promise<T[]> {
  try {
    const content = await readFile(localFile(filename), "utf8");
    return content
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as T);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export function isLocalExportEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_LOCAL_DEMO_EXPORT === "true"
  );
}
