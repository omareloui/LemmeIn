import type { Document } from "../deps.ts";

type ID = string | Document;

export type NormalizedDoc<T> = { id: ID } & Omit<T, "_id">;

function replaceUnderScoreIdWithId<T extends { _id: ID }>(
  doc: T
): NormalizedDoc<T> {
  const y = { id: doc._id, ...doc };
  delete (y as { _id?: string })._id;
  return y;
}

export function normalizeDocument<T extends { _id: ID }>(
  document: T | undefined
): NormalizedDoc<T> | undefined {
  if (!document) return undefined;
  return replaceUnderScoreIdWithId(document);
}

export function normalizeDocuments<T extends { _id: ID }>(
  documents: T[]
): NormalizedDoc<T>[] {
  return documents.map((x) => normalizeDocument(x) as NormalizedDoc<T>);
}
