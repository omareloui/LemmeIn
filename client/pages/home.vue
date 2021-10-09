<template>
  <container padding-bottom no-heading>
    <section class="strength-summery">
      <glass-strength-summery
        v-for="strength in ['safe', 'okay', 'weak', 'compromised']"
        :key="strength"
        :title="strength"
        :number="$accessor.analyze[strength].counter"
        :color="getStrengthColor(strength, $accessor.analyze[strength].counter)"
      />
      <glass-strength-summery
        title="outdated"
        :number="$accessor.analyze.outdated.counter"
        :color="$accessor.analyze.outdated.counter === 0 ? 'safe' : 'danger'"
      />
      <glass-strength-summery
        title="duplicated"
        :number="$accessor.analyze.duplicated.counter"
        :color="$accessor.analyze.duplicated.counter === 0 ? 'safe' : 'danger'"
      />
    </section>
  </container>
</template>


<script lang="ts">
import Vue from "vue"

type Strength = "compromised" | "weak" | "okay" | "safe"

export default Vue.extend({
  methods: {
    getStrengthColor(s: Strength, accountsCounter: number) {
      if (["compromised", "weak", "okay"].includes(s) && accountsCounter === 0)
        return "safe"
      if (s === "okay") return "warn"
      if (s === "safe") return "safe"
      return "danger"
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.strength-summery
  +grid(1fr, $gap: 10px, $center: true)
  +w(max 350px)
  +mx(auto)

  +lt-narrow
    +columns(repeat(2, 1fr))

  +lt-desktop
    +columns(repeat(6, 1fr))
    +w(max unset)
    +mx(unset)
</style>
