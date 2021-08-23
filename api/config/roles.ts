export const roles = ["user", "admin"];
export const roleRights = new Map();

const userRights = ["getMe", "getPasswords"] as const;
const adminRights = [...userRights, "getUsers", "manageUsers"] as const;

roleRights.set(roles[0], userRights);
roleRights.set(roles[1], adminRights);

const rights = [...new Set([...userRights, ...adminRights])];
export type Rights = typeof rights;
