<template>
  <div class="recent-accounts">
    <div class="title">
      <h3 class="title__heading">Recently used</h3>
      <link-base class="title__link" to="/vault">Go to vault</link-base>
    </div>

    <slider :item-width="85" :gap="10">
      <swiper-slide v-for="acc in accs" :key="acc.id" class="account">
        <glass-card
          class="account__card"
          :blur="10"
          :opacity="0.4"
          back-shape="circle"
          back-shape-size="60%"
          :back-shape-color="
            Array.isArray(acc.icon.color)
              ? $accessor.theme.currentTheme === 'light'
                ? acc.icon.color[0]
                : acc.icon.color[1]
              : acc.icon.color
          "
          tint="background-secondary"
          is-back-shape-hex-color
        >
          <link-base class="account__icon-wrapper" :to="`/vault/${acc.id}`">
            <icon
              :name="`app-${acc.icon.name}`"
              :fill="acc.icon.color"
              :view-box="acc.icon.viewBox"
              size="60px"
              :aria-label="acc.icon.name"
            />
          </link-base>
        </glass-card>
      </swiper-slide>
    </slider>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Account, Icon } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

export default Vue.extend({
  props: {
    accounts: { type: Array as PropType<Account[]>, required: true }
  },

  computed: {
    accs(): (Account & { icon: Icon })[] {
      return this.accounts.map(x => ({ ...x, icon: getIcon(x) }))
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.recent-accounts

  .title
    +flex($space-between: true, $wrap: false, $gap: 5px)
    +w(100%)
    +e(heading)
      align-self: baseline
      +fnt-4xl
    +e(link)
      +underline
      +italic
      +fnt-sm
      +clr-txt(main, $opacity: 0.8)
      +no-wrap
      align-self: baseline

  .account
    +e(card)
      +pos-r
      +size(85px)
    +e(icon-wrapper)
      +pos-r
      +block
      +size(100%)
      +br-xl
      i
        +center
</style>
