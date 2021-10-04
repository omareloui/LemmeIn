import { Tag } from "."

export interface AddNote {
  body: string
  title?: string
  tags?: string[]
}

export interface UpdateNote extends AddNote {
  id?: string
}

export interface Note {
  id: string
  title: string
  body: string
  tags: Tag[]
  user: string
}
