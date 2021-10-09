<template>
  <container padding-bottom no-heading class="home">
    <section class="accounts-health">
      <home-accounts-summery />
    </section>

    <section class="strength-summery">
      <div class="strength-summery__cards">
        <home-strength-summery
          v-for="strength in ['safe', 'okay', 'weak', 'compromised']"
          :key="strength"
          :title="strength"
          :number="$accessor.analyze[strength].counter"
          :color="
            getStrengthColor(strength, $accessor.analyze[strength].counter)
          "
        />
        <home-strength-summery
          v-for="prop in ['outdated', 'duplicated']"
          :key="prop"
          :title="prop"
          :number="$accessor.analyze[prop].counter"
          :color="$accessor.analyze[prop].counter === 0 ? 'safe' : 'danger'"
        />
      </div>
      <link-base class="strength-summery__link" to="/accounts-health"
        >More info</link-base
      >
    </section>

    <section class="recently-used" v-if="recentlyUsed.length">
      <home-recently-used :accounts="recentlyUsed" />
    </section>

    <section class="newly-added">
      <home-newly-added />
    </section>
  </container>
</template>


<script lang="ts">
import Vue from "vue"
import { Account } from "~/@types"

type Strength = "compromised" | "weak" | "okay" | "safe"

export default Vue.extend({
  computed: {
    recentlyUsed(): Account[] {
      return this.$accessor.vault.accounts
        .filter(x => x.lastUsed)
        .sort(
          (a, b) =>
            Number(new Date(b.lastUsed || 0)) -
            Number(new Date(a.lastUsed || 0))
        )
        .slice(0, 15)
    }
  },
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
  +e(cards)
    +grid(1fr, $gap: 20px, $center: true)
    +w(max 500px)
    +mx(auto)

    +lt-narrow
      +columns(repeat(2, 1fr))

    +lt-desktop
      +columns(repeat(6, 1fr))
      +w(max unset)
      +mx(unset)

  +e(link)
    +block
    +mt(5px)
    +center-text
    +underline
    +italic
    +fnt-lg

.recently-used,
.newly-added
  +mt(20px)
</style>
