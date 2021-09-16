import { InputSelectOption } from "."

export type InputTypes =
  | "text"
  | "email"
  | "password"
  | "select"
  | "radio"
  | "check"
  | "file"
  | "tag-color"
  | "tags"
  | "textarea"

export type AcceptableFormValues =
  | string
  | string[]
  | File[]
  | { id: string; [key: string]: string | number | boolean }[]

export type FormValues = { [fieldId: string]: AcceptableFormValues }

export type FormGap = "gap"

export interface FormField {
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
    focusOnMount: boolean
    noIcon: boolean
  }>
  style?: "half"
}

export type FormStructure = (FormField | FormGap)[]
