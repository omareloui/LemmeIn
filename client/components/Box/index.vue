<template>
  <component :is="tag" :class="className">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

type ValueType = "padding" | "margin" | "size"

const cssUnits = [
  "px",
  "pt",
  "pc",
  "cm",
  "mm",
  "Q",
  "in",
  "lh",
  "em",
  "ex",
  "ch",
  "rem",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "%"
] as const

const borderRadiusSizes = ["sm", "md", "lg", "xl"] as const

type CssUnitsType = typeof cssUnits[number]
type BorderRadiusSize = typeof borderRadiusSizes[number]

type Inset = {
  t?: string | number
  b?: string | number
  l?: string | number
  r?: string | number
}

const unitValidator = (v: CssUnitsType) => cssUnits.indexOf(v) > -1
const borderRadiusSizeValidator = (v: BorderRadiusSize) =>
  borderRadiusSizes.indexOf(v) > -1

export default Vue.extend({
  props: {
    className: { type: String, default: "box" },
    defaultUnit: {
      type: String as PropType<CssUnitsType>,
      default: "px",
      validator: unitValidator
    },
    marginUnit: {
      type: String as PropType<CssUnitsType>,
      validator: unitValidator
    },
    paddingUnit: {
      type: String as PropType<CssUnitsType>,
      validator: unitValidator
    },
    sizeUnit: {
      type: String as PropType<CssUnitsType>,
      validator: unitValidator
    },

    tag: { type: String, default: "div" },

    br: {
      type: String as PropType<BorderRadiusSize>,
      validator: borderRadiusSizeValidator
    },

    bg: { type: String },
    clr: { type: String },

    w: { type: String },
    h: { type: String },

    pa: { type: String },
    pt: { type: String },
    pb: { type: String },
    pl: { type: String },
    pr: { type: String },
    px: { type: String },
    py: { type: String },

    ma: { type: String },
    mt: { type: String },
    mb: { type: String },
    ml: { type: String },
    mr: { type: String },
    mx: { type: String },
    my: { type: String },

    centerText: { type: Boolean, default: false },
    grid: { type: Boolean, default: false },
    gap: { type: String },
    centerItems: { type: Boolean, default: false },
    gridTemplateColumns: { type: String },
    gridTemplateRows: { type: String },
    minColumnWidth: { type: String }
  },

  mounted() {
    this.appendStylesToDocument()
  },

  computed: {
    style(): string {
      const marginsAndPaddings = this.paddingAndMarginStyle
      const size = this.sizeStyle
      const br = this.borderRadiusStyle
      const bg = this.backgroundStyle
      const clr = this.colorStyle
      const booleanStuff = this.booleanStyle
      const grid = this.gridStyle
      return marginsAndPaddings + size + br + bg + clr + booleanStuff + grid
    },

    backgroundStyle(): string {
      return this.bg ? `background: ${this.normalizeColor(this.bg)};` : ""
    },

    colorStyle(): string {
      return this.clr ? `color: ${this.normalizeColor(this.clr)};` : ""
    },

    booleanStyle() {
      let result = ""
      if (this.centerText) result += "text-align: center;"
      return result
    },

    gridStyle() {
      let result = ""
      // Set display to gird if any related property is passed to the component
      if (
        this.grid ||
        this.gap ||
        this.centerItems ||
        this.gridTemplateColumns ||
        this.gridTemplateRows ||
        this.minColumnWidth
      )
        result += "display: grid;"

      if (this.gap) result += `gap: ${this.normalizeValue(this.gap, "size")};`
      if (this.centerItems) result += `place-items: center;`
      if (this.gridTemplateRows)
        result += `grid-template-rows: ${this.gridTemplateRows};`
      if (this.gridTemplateColumns && !this.minColumnWidth)
        result += `grid-template-columns: ${this.gridTemplateColumns};`
      if (this.minColumnWidth)
        result += `grid-template-columns: repeat(auto-fit, minmax(${this.normalizeValue(
          this.minColumnWidth,
          "size"
        )}, 1fr);`
      return result
    },

    borderRadiusStyle(): string {
      return this.br ? `border-radius: var(--br-${this.br});` : ""
    },

    sizeStyle(): string {
      let result = ""
      if (this.w) result += `width: ${this.normalizeValue(this.w, "size")};`
      if (this.h) result += `height: ${this.normalizeValue(this.h, "size")};`
      return result
    },

    paddingAndMarginStyle(): string {
      const p: Inset = {}
      const m: Inset = {}

      if (this.pa || this.px || this.pl)
        p.l = this.normalizeValue(this.pl || this.px || this.pa, "padding")
      if (this.pa || this.px || this.pr)
        p.r = this.normalizeValue(this.pr || this.px || this.pa, "padding")
      if (this.pa || this.py || this.pt)
        p.t = this.normalizeValue(this.pt || this.py || this.pa, "padding")
      if (this.pa || this.py || this.pb)
        p.b = this.normalizeValue(this.pb || this.py || this.pa, "padding")

      if (this.ma || this.mx || this.ml)
        m.l = this.normalizeValue(this.ml || this.mx || this.ma, "margin")
      if (this.ma || this.mx || this.mr)
        m.r = this.normalizeValue(this.mr || this.mx || this.ma, "margin")
      if (this.ma || this.my || this.mt)
        m.t = this.normalizeValue(this.mt || this.my || this.ma, "margin")
      if (this.ma || this.my || this.mb)
        m.b = this.normalizeValue(this.mb || this.my || this.ma, "margin")

      let paddingStyle = ""
      let marginStyle = ""

      const insets = ["top", "right", "bottom", "left"] as const

      insets.forEach(x => {
        const firstLetter = x[0] as "t" | "b" | "l" | "r"
        if (p[firstLetter]) paddingStyle += `padding-${x}: ${p[firstLetter]};`
        if (m[firstLetter]) marginStyle += `margin-${x}: ${m[firstLetter]};`
      })

      return paddingStyle + marginStyle
    }
  },

  methods: {
    // ==== Helpers ==== //
    checkIfNeedsUnit(v: string) {
      if (
        v.match(/^auto|unset|inherit|initial|revert$/) ||
        v.match(/^\d+(%|(r)?e[mx]|Q|[cm]m|in|p[tcx]|ch|v(w|h|min|max)|lh)$/i)
      )
        return false
      if (v.match(/^\d+$/)) return true
      throw new Error("Invalid value provided for the box component.")
    },

    checkIfNeedsColorWrapper(c: string) {
      if (
        c.match(/^#[0-9a-f]{3,8}$/i) ||
        c.match(/^hsla?\([^)]+\)$/) ||
        c.match(/^rgba?\([^)]+\)$/)
      )
        return false
      return true
    },

    normalizeValue(value: string, valueType: ValueType): string {
      const needsUnit = this.checkIfNeedsUnit(value)
      if (!needsUnit) return value

      let neededUnit = ""
      // Set the unit if a specific one is set
      if (valueType === "padding") neededUnit = this.paddingUnit
      else if (valueType === "margin") neededUnit = this.marginUnit
      else if (valueType === "size") neededUnit = this.sizeUnit
      // Set the unit to the default if not specific one is set
      if (!neededUnit) neededUnit = this.defaultUnit

      return `${value}${neededUnit}`
    },

    normalizeColor(c: string) {
      return this.checkIfNeedsColorWrapper(c) ? `var(--clr-${c});` : c
    },

    // BUILDING THE STYLE
    getCurrentVHash() {
      return Object.keys((this.$el as HTMLElement).dataset)[0]
    },

    stylesBuilder() {
      return `
        .${this.className}[data-${this.getCurrentVHash()}] {
          ${this.style}
        }
      `
    },

    getLastStyleTag() {
      const styleTags = document.head.getElementsByTagName("style")
      return styleTags[styleTags.length - 1]
    },

    appendStylesToDocument() {
      const stylesBody = this.stylesBuilder()
      const styleTag = this.getLastStyleTag()
      styleTag.innerHTML += stylesBody
    }
  }
})
</script>

<style scoped></style>
