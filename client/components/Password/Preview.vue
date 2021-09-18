<template>
  <div>
    <icon
      :name="`app-${icon.name}`"
      :fill="icon.color"
      :view-box="icon.viewBox"
      size="50px"
    />

    <link-base :to="`/passwords/${password.id}`">
      {{ password.app }}
    </link-base>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Password } from "~/@types"
import getIcon from "~/assets/utils/getIcon"

export default Vue.extend({
  props: {
    password: { type: Object as PropType<Password>, required: true }
  },
  data() {
    return {
      icon: getIcon(this.password)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
