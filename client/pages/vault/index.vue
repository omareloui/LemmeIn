 <template>
  <container padding-bottom class="accounts-page">
    <template #heading>The Vault</template>
    <input-search
      v-if="hasAccounts"
      v-model="searchQuery"
      placeholder="Search the vault..."
      class="search-input"
      :search-elements="accounts"
      :search-keys="['app', 'accountIdentifier', 'site', 'tags.name']"
      @search-result="searchResult = $event"
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
        name="list"
        tag="div"
        class="accounts"
      >
        <div
          v-for="account in searchQuery ? searchResult : accounts"
          :key="account.id"
        >
          <account-preview v-bind="{ account }" include-strength />
        </div>
      </transition-group>
    </main>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import { Account } from "~/@types"

export default Vue.extend({
  computed: {
    accounts(): Account[] {
      return this.$accessor.vault.accounts
    },

    hasAccounts(): boolean {
      return this.$accessor.vault.accounts.length > 0
    }
  },

  data() {
    return {
      searchQuery: (this.$route.query.search as string | undefined) || "",
      searchResult: [] as Account[]
    }
  },

  watch: {
    searchQuery(newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: Record<string, any> = { ...this.$route.query }
      if (newValue) query.search = newValue
      else delete query.search
      this.$router.push({
        path: this.$route.path,
        query
      })
    }
  }
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
