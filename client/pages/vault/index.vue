 <template>
  <container has-padding-bottom class="accounts-page">
    <template #heading>The Vault</template>
    <input-search
      v-if="hasAccounts"
      v-model="searchQuery"
      placeholder="Search the vault..."
      class="search-input"
      @clear="searchQuery = ''"
    />

    <main>
      <div class="no-account" v-if="!hasAccounts">
        <div class="no-account__body">
          <h2 class="no-account__heading">No accounts yet!</h2>
          <span class="no-account__add">
            You can add an account by clicking on the floating menu on the
            bottom right.
          </span>
        </div>
      </div>

      <transition-group
        v-if="hasAccounts"
        name="account"
        tag="div"
        class="accounts"
      >
        <div
          v-for="account in searchQuery
            ? searchResult
            : $accessor.vault.accounts"
          :key="account.id"
        >
          <account-preview v-bind="{ account }" />
        </div>
      </transition-group>
    </main>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import Fuse from "fuse.js"
import { Account } from "~/@types"

export default Vue.extend({
  computed: {
    hasAccounts(): boolean {
      return this.$accessor.vault.accounts.length > 0
    },

    searchResult(): Account[] {
      const fuse = new Fuse<Account>(this.$accessor.vault.accounts, {
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

.accounts-page
  .search-input
    +my(20px)
    +lt-tablet
      +mx(min(100px, 5vw))

  main
    .accounts
      +grid($gap: 20px)

    .no-account
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
