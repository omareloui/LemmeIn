import type { Account } from "./index.ts";

export type DuplicatedPasswords = {
  [plainPassword: string]: { passwordsId: string[] };
};

export interface AnalyzeValue {
  counter: number;
  accounts: Account[];
}

export type PasswordAnalyzesStrengths =
  | "compromised"
  | "weak"
  | "okay"
  | "safe";
export type AnalyzeKeys = PasswordAnalyzesStrengths | "outdated" | "duplicated";

export type Analyze = {
  [key in AnalyzeKeys]: AnalyzeValue;
};

export type BuildAnalyzesOptions = {
  [key in keyof Analyze]: Account[];
};
