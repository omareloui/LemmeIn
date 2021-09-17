import Vue from "vue"

export interface InputText extends Vue {
  validate: () => void
  errorMessage: string
  isErred: boolean
}

export interface InputPassword extends InputText {
  hasOAuth: boolean
  isOAuth: boolean
}
