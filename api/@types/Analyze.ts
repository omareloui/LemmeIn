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

export type BuildAnalyzesOptions = {
  [key in AnalyzeKeys]: Account[];
} & {
  totalAccounts: number;
  nonOAuthAccounts: number;
};

export type Analyze = {
  [key in AnalyzeKeys]: AnalyzeValue;
} & {
  totalAccounts: number;
  score: number;
};
