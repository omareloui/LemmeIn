import { Account, Tag, Note, Analyze } from "."

export interface Resources {
  accounts: Account[]
  tags: Tag[]
  notes: Note[]
  analyzes: Analyze
}
