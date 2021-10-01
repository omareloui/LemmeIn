export const roles = ["user", "admin"] as const;
export const roleRights = new Map();

const userRights = ["getMe", "manageMyAccounts", "manageMyTags"] as const;
const adminRights = [...userRights, "getUsers", "manageUsers"] as const;

roleRights.set(roles[0], userRights);
roleRights.set(roles[1], adminRights);

const rights = [...new Set([...userRights, ...adminRights])];

export type Role = typeof roles[number];
export type Rights = typeof rights;
