function checkIfMongoId(id: string) {
  if (id.length !== 24) return false;
  const mongoIdPattern = /^[\da-f]{24}$/;
  if (!id.match(mongoIdPattern)) return false;
  return true;
}

export default checkIfMongoId;
