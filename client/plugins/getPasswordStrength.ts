import { Plugin } from "@nuxt/types"
import { passwordStrength } from "check-password-strength"
import {
  PasswordStrength,
  PasswordScore,
  PasswordDiversity,
  PasswordStrengthValues,
  PasswordStrengthColors
} from "~/@types"
import getDatePrevMonths from "~/assets/utils/getDatePrevMonths"

const DIVERSITIES: PasswordDiversity[] = [
  "lowercase",
  "uppercase",
  "number",
  "symbol"
]

function calculateScore(
  { contains, length }: Pick<PasswordStrength, "contains" | "length">,
  lastUpdated: Date,
  isDuplicated: boolean
): PasswordScore {
  let score = 0
  const suggestions: string[] = []

  // Calc score for length
  if (length >= 16) score += 8
  else {
    if (length >= 10) score += 4
    else if (length >= 8) score += 3
    else if (length >= 6) score += 2
    else if (length >= 4) score += 1
    suggestions.push("Make it longer")
  }

  // Calc score if it's duplicated or not
  if (!isDuplicated) score++
  else suggestions.push("It's duplicated should be changed")

  // Calc score if diversity
  DIVERSITIES.forEach(x => {
    if (contains.indexOf(x) > -1) score++
    else suggestions.push(`Add ${x}`)
  })

  // Calc score for last update date
  const oldestDateToAccept = getDatePrevMonths(3)
  if (Number(oldestDateToAccept) < Number(new Date(lastUpdated))) score++
  else suggestions.push("Too old, should be updated")

  // Define max score
  const maxScore = 14

  // Set percentage
  const percentage = Math.floor(((score || 1) / (maxScore || 1)) * 100)

  // Set the vault
  let value: PasswordStrengthValues
  if (percentage > 90) value = "safe"
  else if (percentage > 75) value = "okay"
  else if (percentage > 50) value = "weak"
  else value = "compromised"

  // Set the color
  let color: PasswordStrengthColors
  if (value === "safe") color = "--clr-safe"
  else if (value === "okay" || value === "weak") color = "--clr-warn"
  else color = "--clr-danger"

  return { score, maxScore, percentage, color, suggestions, value }
}

function passwordStrengthWrapper(
  password: string,
  lastUpdated: Date,
  isDuplicated = false
): PasswordStrength {
  const result = passwordStrength(password)
  const score = calculateScore(
    { contains: result.contains, length: result.length },
    lastUpdated,
    isDuplicated
  )
  return {
    contains: result.contains,
    length: result.length,
    ...score
  }
}

type GetPasswordStrength = typeof passwordStrengthWrapper

declare module "vue/types/vue" {
  interface Vue {
    $getPasswordStrength: GetPasswordStrength
  }
}
declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $getPasswordStrength: GetPasswordStrength
  }
  interface Context {
    $getPasswordStrength: GetPasswordStrength
  }
}
declare module "vuex/types/index" {
  interface Store<S> {
    $getPasswordStrength: GetPasswordStrength
  }
}

const getPasswordStrength: Plugin = (_, inject) => {
  inject("getPasswordStrength", passwordStrengthWrapper)
}

export default getPasswordStrength
