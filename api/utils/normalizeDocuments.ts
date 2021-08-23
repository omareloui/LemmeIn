function replaceUnderScoreIdWithId<T extends { _id?: string }>(
  doc: T
): { id: string } & T {
  const y = { id: doc._id, ...doc };
  delete y._id;
  return y as { id: string } & T;
}

export default function normalizeDocuments<T>(documents: T) {
  if (Array.isArray(documents)) return documents.map(replaceUnderScoreIdWithId);
  return replaceUnderScoreIdWithId(documents);
}
