import tagColor from "~/config/tag-colors"

export type TagColor = typeof tagColor[number]

export interface AddTag {
  tag: string
  color: TagColor
}

export type UpdateTag = AddTag

export default interface Tag {
  id: string
  tag: string
  color: TagColor
  user: string
  passwordsCount: number
}
