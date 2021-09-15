export default interface Password {
  id: string
  user: string
  password: string
  app: string
  accountIdentifier: string
  site: string
  note: string
  tags: string[]
  lastUsed: Date
  createdAt: Date
  updatedAt: Date
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
