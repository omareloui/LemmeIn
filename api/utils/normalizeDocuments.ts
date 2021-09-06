export type NormalizedDoc<T> = { id: string } & Omit<T, "_id">;

function replaceUnderScoreIdWithId<T extends { _id: string }>(
  doc: T
): NormalizedDoc<T> {
  const y = { id: doc._id, ...doc };
  delete (y as { _id?: string })._id;
  return y;
}

export function normalizeDocument<T extends { _id: string }>(
  document: T
): NormalizedDoc<T> {
  return replaceUnderScoreIdWithId(document);
}

export function normalizeDocuments<T extends { _id: string }>(
  documents: T[]
): NormalizedDoc<T>[] {
  return documents.map((x) => normalizeDocument(x));
}
