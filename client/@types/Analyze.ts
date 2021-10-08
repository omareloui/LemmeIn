import { Account, PasswordStrengthValues } from "."

export type DuplicatedPasswords = {
  [plainPassword: string]: { passwordsId: string[] }
}

export interface AnalyzeValue {
  counter: number
  accounts: Omit<Account, "password">[]
}

export type AnalyzeKeys = PasswordStrengthValues | "outdated" | "duplicated"

export type Analyze = {
  [key in AnalyzeKeys]: AnalyzeValue
} & {
  totalAccounts: number
  score: number
}
