import { InputSelectOption } from "."

export type InputTypes =
  | "text"
  | "email"
  | "password"
  | "select"
  | "radio"
  | "check"
  | "file"
  | "color"
  | "tags"
export type AcceptableFormValues =
  | string
  | string[]
  | File[]
  | { id: string; [key: string]: string | number | boolean }[]
export type FormValues = { [fieldId: string]: AcceptableFormValues }

export default interface FormField {
  id: string
  type: InputTypes
  value: AcceptableFormValues
  label?: string
  props?: Partial<{
    default: AcceptableFormValues
    notRequired: boolean
    leftIcon: string
    placeholder: string
    hint: string
    minLength: number
    maxLength: number
    pattern: RegExp
    invalidPatternMessage: string
    options: InputSelectOption[]
    primaryKey: string
  }>
  style?: "half"
}
