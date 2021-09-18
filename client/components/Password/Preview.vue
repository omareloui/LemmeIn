<template>
  <glass-card no-back-shape tint="background-main" float>
    <div class="password">
      <div class="info">
        <icon
          class="info__icon"
          :name="`app-${icon.name}`"
          :fill="icon.color"
          :view-box="icon.viewBox"
          size="40px"
        />

        <div class="info__text-info">
          <div class="app">{{ password.app }}</div>
          <div class="account-identifier">{{ password.accountIdentifier }}</div>
        </div>

        <icon
          class="info__copy"
          name="copy"
          size="25px"
          view-box="25.6 32"
          clickable
        />
      </div>

      <div class="tags" v-if="password.tags.length > 0">
        <chip-tag
          v-for="tag in [...password.tags].splice(0, tagsToShow)"
          :key="tag.id"
          class="tags__tag"
          v-bind="{ tag }"
          no-remove-button
          invert
          clickable
          @click="gotToTag(tag)"
        />
        <span v-if="password.tags.length > tagsToShow" class="tags__more">
          +{{ password.tags.length - tagsToShow }}
        </span>
      </div>

      <div class="created-at">
        Added {{ $moment(password.createdAt).fromNow() }}
      </div>
    </div>
  </glass-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Password, Tag } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

export default Vue.extend({
  props: {
    password: { type: Object as PropType<Password>, required: true },
    tagsToShow: { type: Number, default: 5 }
  },

  data() {
    return {
      icon: getIcon(this.password)
    }
  },

  methods: {
    gotToTag(tag: Tag) {
      this.$router.push(`/vault?tag=${tag.id}`)
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
      .app
        +fnt(heading)
        +mb(3px)
      .account-identifier
        +clr-txt(main, $opacity: 0.5)

  .tags
    +mt(10px)
    +e(tag)
      +mb(5px)
      &:not(:last-child)
        +mr(5px)

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
