<template>
  <div class="password-generator">
    <button-glass
      class="password-generator__close"
      icon="close"
      color="cancel"
    />

    <div class="password-generator__generated-password-container">
      <button-base class="regenerate" @click="generate">
        <icon name="reload" size="75%" />
      </button-base>

      <div class="generated-password">
        {{ generatedPassword }}
      </div>

      <button-main class="copy-button" large @click="copy">copy</button-main>
    </div>

    <div class="password-generator__options">
      <input-range
        v-model="length"
        @input="generate"
        identifier="passwordLength"
        :min="minLength"
        :max="84"
      />
      <input-check
        :options="checkBoxes"
        not-required
        @input="generate"
        must-have-one-at-least
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import type { OptionType } from "~/components/Input/Check.vue"

export default Vue.extend({
  data: () => ({
    characters: {
      lower: "abcdefghijklmnopqrstuvwxyz",
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "`~!@#$%^&*()-=_+[]{}|\\;',./<>?"
    },

    generatedPassword: "",

    length: 16,

    checkBoxes: [
      {
        id: "upper",
        value: "capital case letters",
        isChecked: true
      },
      {
        id: "lower",
        value: "lower case letters",
        isChecked: true
      },
      {
        id: "numbers",
        value: "numbers",
        isChecked: true
      },
      {
        id: "symbols",
        value: "symbols",
        isChecked: true
      }
    ] as OptionType[]
  }),

  created() {
    this.generate()
  },

  computed: {
    includeLowerCase(): boolean {
      return this.getCheckboxValue("lower")
    },
    includeUpperCase(): boolean {
      return this.getCheckboxValue("upper")
    },
    includeNumbers(): boolean {
      return this.getCheckboxValue("numbers")
    },
    includeSymbols(): boolean {
      return this.getCheckboxValue("symbols")
    },

    minLength(): number {
      let minLength = 0
      if (this.includeLowerCase) minLength += 1
      if (this.includeUpperCase) minLength += 1
      if (this.includeNumbers) minLength += 1
      if (this.includeSymbols) minLength += 1
      return minLength
    },

    characterSpace(): string {
      let characters = ""
      if (this.includeLowerCase) characters += this.characters.lower
      if (this.includeUpperCase) characters += this.characters.upper
      if (this.includeNumbers) characters += this.characters.numbers
      if (this.includeSymbols) characters += this.characters.symbols
      return characters
    }
  },

  methods: {
    generate() {
      try {
        const characters = this.shuffleArray(this.characterSpace.split(""))
        const generatedPassword: string[] = []
        const {
          includeLowerCase,
          includeUpperCase,
          includeNumbers,
          includeSymbols,
          length
        } = this

        let addedLower = false
        let addedUpper = false
        let addedNumber = false
        let addedSymbol = false

        for (let i = 0; i < length; i++) {
          if (includeLowerCase && !addedLower) {
            generatedPassword.push(this.getRandomCharacter("lower"))
            addedLower = true
          } else if (includeUpperCase && !addedUpper) {
            generatedPassword.push(this.getRandomCharacter("upper"))
            addedUpper = true
          } else if (includeNumbers && !addedNumber) {
            generatedPassword.push(this.getRandomCharacter("numbers"))
            addedNumber = true
          } else if (includeSymbols && !addedSymbol) {
            generatedPassword.push(this.getRandomCharacter("symbols"))
            addedSymbol = true
          } else {
            const randomIndex = Math.floor(Math.random() * characters.length)
            generatedPassword.push(characters[randomIndex])
          }
        }

        this.generatedPassword = this.shuffleArray(generatedPassword).join("")
      } catch (e) {
        this.$notify.error(e.message)
      }
    },

    // Options utils //
    getCheckboxValue(checkboxId: "lower" | "upper" | "numbers" | "symbols") {
      const checkBox = this.checkBoxes.find(x => x.id === checkboxId)
      return !!checkBox?.isChecked
    },

    // Password generator utils //
    validatePasswordRequirements() {
      if (this.length < this.minLength)
        throw new Error(
          `You can't set the length to "${this.length}" with the selected options`
        )
    },

    getRandomCharacter(
      characterType: "upper" | "lower" | "numbers" | "symbols"
    ) {
      const charactersToGetFrom = this.characters[characterType]
      const index = this.generateRandomNumber(charactersToGetFrom.length)
      return charactersToGetFrom[index]
    },

    // General utils //
    shuffleArray<T>(originalArray: T[]): T[] {
      const arr = [...originalArray]
      for (let i = arr.length - 1; i > 0; i--) {
        const newPos = Math.floor(Math.random() * (i + 1)) as number
        ;[arr[i], arr[newPos]] = [arr[newPos], arr[i]]
      }
      return arr
    },

    generateRandomNumber(max: number) {
      return Math.floor(Math.random() * max)
    },

    copy() {
      navigator.clipboard.writeText(this.generatedPassword)
      this.$notify.success("Copied password!")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.password-generator
  +pos-r
  +clr-bg(main)
  +float(2)
  +br-lg
  +py(55px)

  +e(close)
    +pos-a(top 10px right 20px)

  +e(generated-password-container)
    +pos-r
    +clr-bg(secondary)
    +px(5%)
    +py(35px)
    +ma(auto)
    +mb(45px)
    +br-md
    +w(85%)
    +lt-mobile
      +w(max(60%, 250px))

    .generated-password
      +fnt-xl
      +my(auto)
      +mb(20px)
      +break-word
      +center-text

    .regenerate
      +pos-a(top 10px right 15px)
      +size(clamp(30px, 3vw, 35px))
      +br-cr
      +lt-tablet
        top: 15px
        right: 40px
      ::v-deep i
        +center

    .copy-button
      +ma(auto)
      +block

  +e(options)
    ::v-deep
      .checker-wrapper
        +mx(auto)
        max-width: 500px
        +e(options)
          grid-template-columns: repeat(2, 1fr)
          +lt-mobile
            grid-template-columns: repeat(4, 1fr)
    ::v-deep
      .input-range-container
        +mx(auto)
</style>
