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
