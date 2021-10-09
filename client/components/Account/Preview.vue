<template>
  <glass-card no-back-shape tint="background-main" float>
    <div
      class="account"
      :class="{
        'account--has-strength': showStrength
      }"
    >
      <div class="info">
        <password-strength
          class="info__strength"
          v-if="showStrength"
          shape="dot"
          dot-size="10px"
          hide-score-text
          :decrypted-password="account.decryptedPassword"
        />

        <icon
          class="info__icon"
          :name="`app-${icon.name}`"
          :fill="icon.color"
          :view-box="icon.viewBox"
          size="40px"
        />

        <div class="info__text-info">
          <link-base class="app" :to="`/vault/${account.id}`">
            {{ account.app }}
          </link-base>
          <div v-if="account.accountIdentifier" class="account-identifier">
            {{ account.accountIdentifier }}
            <icon
              name="copy"
              clickable
              @click="copyAccId"
              @keyup:enter="copyAccId"
              @keyup:space="copyAccId"
              aria-label="copy account identifier"
              size="15px"
              focusable
            />
          </div>
        </div>

        <icon
          v-if="notOAuth"
          class="info__copy"
          name="copy"
          size="25px"
          view-box="25.6 32"
          clickable
          @click="copy"
        />
      </div>

      <div class="tags" v-if="!noTags && account.tags.length > 0">
        <link-base
          v-for="tag in [...account.tags].splice(0, tagsToShow)"
          :key="tag.id"
          :to="`/vault?tags=${tag.id}`"
        >
          <chip-tag
            class="tags__tag"
            v-bind="{ tag }"
            no-remove-button
            invert
            clickable
          />
        </link-base>
        <span v-if="account.tags.length > tagsToShow" class="tags__more">
          +{{ account.tags.length - tagsToShow }}
        </span>
      </div>

      <div v-if="!noDate" class="created-at">
        Added {{ $moment(account.createdAt).fromNow() }}
      </div>
    </div>
  </glass-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Account } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

export default Vue.extend({
  props: {
    account: { type: Object as PropType<Account>, required: true },
    tagsToShow: { type: Number, default: 5 },
    noDate: { type: Boolean, default: false },
    noTags: { type: Boolean, default: false },
    includeStrength: { type: Boolean, default: false }
  },

  data() {
    return {
      icon: getIcon(this.account)
    }
  },

  computed: {
    showStrength(): boolean {
      return (
        this.includeStrength &&
        this.notOAuth &&
        !!this.account.decryptedPassword
      )
    },

    notOAuth(): boolean {
      return !this.account.password
    }
  },

  methods: {
    copyAccId() {
      if (!this.account.accountIdentifier)
        this.$notify.error("No account identifier")
      else this.$copy(this.account.accountIdentifier)
    },

    copy() {
      this.$accessor.vault.copy(this.account.id)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.account
  +br-lg
  +pa(10px 20px)

  .info
    +grid(45px 1fr 30px, $gap: 15px)

    +e(text-info)
      align-self: center
      overflow: auto
      +no-scroll
      .app
        +fnt(heading)
        +mb(3px)
      .account-identifier
        +clr-txt(main, $opacity: 0.5)

    +e(copy)
      align-self: center

  +m(has-strength)
    .info
      +grid(10px 45px 1fr 30px, $gap: 10px)
      +e(strength)
        align-self: center

  .tags
    +flex($gap: 4px 10px)
    +my(10px)

    +e(more)
      +inline-block
      +br-cr
      +size(30px)
      +fnt-xs
      +clr-bg(primary, $opacity: 0.4)
      +center-text
      line-height: 30px
      backdrop-filter: blur(4px)

  .created-at
    +clr-txt(main, $opacity: 0.5)
    +fnt-xs
    +mt(5px)
</style>
