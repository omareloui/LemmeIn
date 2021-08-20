<template>
  <container>
    <template #heading>lemme in</template>
    <link-base to="/passwords">passwords</link-base>
  </container>
</template>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

@each $size in "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"
  .fnt-#{$size}
    +fnt-s($size)
</style>
