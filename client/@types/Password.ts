import { Tag } from "."

export interface Password {
  id: string
  user: string
  password?: Password | string
  app: string
  accountIdentifier?: string
  site?: string
  note?: string
  tags?: Tag[]
  lastUsed: Date | null
  createdAt: Date
  updatedAt: Date

  decryptedPassword?: string
}

export interface AddPasswordReceivedData {
  app: string
  password: { value: string; isOAuth: boolean }
  accountIdentifier?: string
  site?: string
  note?: string
  tags?: string[]
}

export interface AddPassword {
  app: string
  password: string
  isOAuth: boolean
  accountIdentifier?: string
  site?: string
  note?: string
  tags?: string[]
}

export type PasswordStrengthIDs = 0 | 1 | 2 | 3
export type PasswordDiversity = "lowercase" | "uppercase" | "symbol" | "number"
export type PasswordStrengthValues = "compromised" | "weak" | "okay" | "safe"
export type PasswordStrengthColors =
  | "--clr-danger"
  | "--clr-warn"
  | "--clr-safe"

export interface PasswordScore {
  score: number
  maxScore: number
  percentage: number
  suggestions: string[]
  value: PasswordStrengthValues
  color: PasswordStrengthColors
}

export interface PasswordStrength extends PasswordScore {
  contains: PasswordDiversity[]
  length: number
}
