<template>
  <container>
    <template #heading>lemme in</template>
    <link-base to="/passwords">passwords</link-base>
    <link-base to="/tags">tags</link-base>
    <client-only>
      <toggle-theme />
    </client-only>
  </container>
</template>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
