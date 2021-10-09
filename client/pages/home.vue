<template>
  <container padding-bottom no-heading class="home">
    <section class="accounts-health">
      <glass-accounts-summery />
    </section>

    <section class="strength-summery">
      <glass-strength-summery
        v-for="strength in ['safe', 'okay', 'weak', 'compromised']"
        :key="strength"
        :title="strength"
        :number="$accessor.analyze[strength].counter"
        :color="getStrengthColor(strength, $accessor.analyze[strength].counter)"
      />
      <glass-strength-summery
        v-for="prop in ['outdated', 'duplicated']"
        :key="prop"
        :title="prop"
        :number="$accessor.analyze[prop].counter"
        :color="$accessor.analyze[prop].counter === 0 ? 'safe' : 'danger'"
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

.accounts-health
  +mb(20px)

.strength-summery
  +grid(1fr, $gap: 20px, $center: true)
  +w(max 500px)
  +mx(auto)

  +lt-narrow
    +columns(repeat(2, 1fr))

  +lt-desktop
    +columns(repeat(6, 1fr))
    +w(max unset)
    +mx(unset)
</style>
