<template>
  <glass-card no-back-shape tint="background-main" float>
    <div
      class="password"
      :class="{
        'password--has-strength':
          includeStrength && notOAuth && decryptedPassword
      }"
    >
      <div class="info">
        <password-strength
          class="info__strength"
          v-if="includeStrength && notOAuth && decryptedPassword"
          shape="dot"
          dot-size="10px"
          hide-score-text
          :decrypted-password="decryptedPassword"
        />

        <icon
          class="info__icon"
          :name="`app-${icon.name}`"
          :fill="icon.color"
          :view-box="icon.viewBox"
          size="40px"
        />

        <div class="info__text-info">
          <link-base class="app" :to="`/passwords/${password.id}`">
            {{ password.app }}
          </link-base>
          <div v-if="password.accountIdentifier" class="account-identifier">
            {{ password.accountIdentifier }}
            <icon
              name="copy"
              clickable
              @click="$copy(password.accountIdentifier)"
              @keyup:enter="$copy(password.accountIdentifier)"
              @keyup:space="$copy(password.accountIdentifier)"
              aria-label="copy account identifier"
              size="15px"
              focusable
            />
          </div>
        </div>

        <icon
          v-if="!password.password"
          class="info__copy"
          name="copy"
          size="25px"
          view-box="25.6 32"
          clickable
          @click="copy"
        />
      </div>

      <div class="tags" v-if="!noTags && password.tags.length > 0">
        <link-base
          v-for="tag in [...password.tags].splice(0, tagsToShow)"
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
        <span v-if="password.tags.length > tagsToShow" class="tags__more">
          +{{ password.tags.length - tagsToShow }}
        </span>
      </div>

      <div v-if="!noDate" class="created-at">
        Added {{ $moment(password.createdAt).fromNow() }}
      </div>
    </div>
  </glass-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Password } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

export default Vue.extend({
  props: {
    password: { type: Object as PropType<Password>, required: true },
    tagsToShow: { type: Number, default: 5 },
    noDate: { type: Boolean, default: false },
    noTags: { type: Boolean, default: false },
    includeStrength: { type: Boolean, default: false }
  },

  created() {
    if (this.includeStrength && this.notOAuth) this.decryptPassword()
  },

  data() {
    return {
      icon: getIcon(this.password),
      decryptedPassword: ""
    }
  },

  computed: {
    notOAuth(): boolean {
      return !this.password.password
    }
  },

  methods: {
    async decryptPassword() {
      this.decryptedPassword = await this.$accessor.vault.decryptPassword(
        this.password.id
      )
    },

    copy() {
      this.$accessor.vault.copy(this.password.id)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.password
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
