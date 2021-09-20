 <template>
  <container has-padding-bottom class="passwords-page">
    <template #heading>The Vault</template>
    <input-search
      v-if="$accessor.vault.passwords.length !== 0"
      v-model="searchQuery"
      placeholder="Search passwords..."
      class="search-input"
      @clear="searchQuery = ''"
    />

    <main>
      <div class="no-password" v-if="$accessor.vault.passwords.length === 0">
        <pattern-dots left="40px" />
        <div class="no-password__body">
          <h2 class="no-password__heading">No password yet!</h2>
          <span class="no-password__add">
            You can add a password by clicking on the floating menu on the
            bottom right.
          </span>
        </div>
      </div>

      <transition-group
        v-if="$accessor.vault.passwords.length !== 0"
        name="password"
        tag="div"
        class="passwords"
      >
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
    searchQuery: ""
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
      +grid($gap: 20px)

    .no-password
      +grid($center: true)
      +center-text
      +h(min 400px)
      +w(max 700px)
      +mx(auto)
      overflow: auto
      +no-scroll

      +e(heading)
        +clr-txt(main, $opacity: 0.8)
        +mb(20px)

      +e(add)
        +fnt-base
</style>
