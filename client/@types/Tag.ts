export interface AddTag {
  tag: string
  color: string
}

export type UpdateTag = AddTag

export default interface Tag {
  id: string
  tag: string
  color: string
  user: string
  passwordsCount: number
}
