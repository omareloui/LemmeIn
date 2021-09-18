 <template>
  <container has-padding-bottom class="passwords-page">
    <template #heading>The Vault</template>

    <icon
      v-for="icon in icons"
      :key="icon.name"
      :name="`app-${icon.name}`"
      :fill="icon.color"
      :view-box="icon.viewBox"
      size="50px"
      :aria-label="icon.name"
    />

    <input-search
      v-model="searchQuery"
      placeholder="Search passwords..."
      class="search-input"
      @clear="searchQuery = ''"
    />

    <main>
      <transition-group name="password" tag="div" class="passwords">
        <div
          class="password"
          v-for="password in searchQuery
            ? searchResult
            : $accessor.vault.passwords"
          :key="password.id"
        >
          <password-preview v-bind="{ password }" />
        </div>
      </transition-group>
    </main>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import Fuse from "fuse.js"
import { Password } from "~/@types"
import icons from "~/config/icons"

export default Vue.extend({
  async beforeCreate() {
    await this.$accessor.vault.getPasswords()
  },

  computed: {
    searchResult(): Password[] {
      const fuse = new Fuse<Password>(this.$accessor.vault.passwords, {
        keys: ["app", "accountIdentifier", "site", "tags.tag"]
      })
      return fuse.search(this.searchQuery).map(x => x.item)
    }
  },

  data: () => ({
    searchQuery: "",
    icons
  })
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.passwords-page
  .search-input
    +my(20px)
    +lt-tablet
      +mx(min(100px, 5vw))

  main
    .passwords
      // +grid
      .password
        &:not(:last-child)
          +mb(20px)
</style>
