import { mutationTree, actionTree, getterTree } from "typed-vuex"
import { take } from "lodash"

import { AddAccount, Account, UpdateAccount } from "~/@types"

export const state = () => ({
  accounts: [] as Account[]
})

export type AccountsState = ReturnType<typeof state>

export const getters = getterTree(state, {
  recentlyUsed(state) {
    // This won't update with the state 'cause of the cloning
    // Note that the icon is the only thing showing from this so
    //   it's not that important
    return take(
      state.accounts
        .filter(x => x.lastUsed)
        .sort(
          (a, b) =>
            Number(new Date(b.lastUsed || 0)) -
            Number(new Date(a.lastUsed || 0))
        ),
      15
    )
  },

  newlyAdded(state) {
    // FIXME: this won't update with the state 'cause of the cloning
    return take(
      [...state.accounts].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt)
      ),
      15
    )
  }
})

export const mutations = mutationTree(state, {
  setAccounts(state, accounts) {
    state.accounts = accounts
  },

  clearAccounts(state) {
    state.accounts = []
  },

  unshiftToAccounts(state, account: Account) {
    state.accounts.unshift(account)
  },

  updateLastUsedCache(state, accountId: string) {
    if (state.accounts.length === 0) return
    const account = state.accounts.find(x => x.id === accountId)
    if (!account) throw new Error("Can't find the account to update last used")
    account.lastUsed = new Date()
  },

  removeAccount(state, accountId: string) {
    state.accounts = state.accounts.filter(x => x.id !== accountId)
  },

  updateAccountCache(state, account) {
    const accIndex = state.accounts.findIndex(x => x.id === account.id)
    if (accIndex === -1)
      throw new Error("Can't find the account to update last used")
    state.accounts[accIndex] = account
  },

  removeTagFromAccounts(state, tagId: string) {
    state.accounts = state.accounts.map(acc => {
      if (acc.tags && acc.tags.length > 0)
        acc.tags = acc.tags.filter(x => x.id !== tagId)
      return acc
    })
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async updateAccountsCache({ dispatch }) {
      const { data } = await this.$axios.get("/accounts")
      const accounts = data as Account[]
      dispatch("decryptAndSetAccounts", accounts)
    },

    async getAccounts({ dispatch }) {
      if (!this.app.$accessor.auth.isSigned) return
      dispatch("updateAccountsCache")
    },

    async getAccount({ state, dispatch }, accountId: string): Promise<Account> {
      try {
        // Check first from cache
        let acc = state.accounts.find(x => x.id === accountId)
        // Get the account if not in cache
        if (!acc) {
          const { data } = await this.$axios.get(`/accounts/${accountId}`)
          const account = data as Account
          acc = await dispatch("decryptAccount", account)
        }
        if (!acc) throw new Error("Can't find the account")
        return acc
      } catch (e) {
        // @ts-ignore
        return this.$notify.error(e.response.data.message)
      }
    },

    async addAccount({ commit, dispatch }, options: AddAccount) {
      await dispatch("encryptAccount", options)
      const { data } = await this.$axios.post("/accounts", options)
      const account = (await dispatch("decryptAccount", data)) as Account
      // TODO: await this.app.$accessor.analyze.addAccount(account)
      this.$notify.success("Created account.")
      commit("unshiftToAccounts", account)
    },

    async editAccount({ commit, dispatch }, options: UpdateAccount) {
      const { id } = options
      delete (options as { id?: string }).id
      await dispatch("encryptAccount", options)
      const { data } = await this.$axios.put(`/accounts/${id}`, options)
      const newAccount = (await dispatch("decryptAccount", data)) as Account
      // TODO: await this.app.$accessor.analyze.editAccount(newAccount)
      commit("updateAccountCache", newAccount)
      this.$notify.success("Updated account.")
      return newAccount
    },

    async deleteAccount(
      { commit },
      {
        accountId,
        accountName,
        goToVaultAfter = true
      }: { accountId: string; accountName: string; goToVaultAfter?: boolean }
    ) {
      try {
        const confirmed = await this.$confirm(
          `Are you sure you want to delete "${accountName}" account?`,
          { acceptMessage: "Delete" }
        )
        if (!confirmed) return
        await this.$axios.delete(`/accounts/${accountId}`)

        // const account = await dispatch("getAccount", accountId)
        // TODO: await this.app.$accessor.analyze.removeAccount(account)

        commit("removeAccount", accountId)
        this.$notify.success("Deleted account successfully")
        if (goToVaultAfter) this.$router.push("/vault")
      } catch (e) {
        // @ts-ignore
        throw new Error(e.response.data.message)
      }
    },

    async decryptAccount({ dispatch }, account: Account): Promise<Account> {
      account.app = await this.app.$cypher.decrypt(account.app)
      account.accountIdentifier =
        account.accountIdentifier &&
        (await this.app.$cypher.decrypt(account.accountIdentifier))
      account.site =
        account.site && (await this.app.$cypher.decrypt(account.site))
      account.note =
        account.note && (await this.app.$cypher.decrypt(account.note))

      if (account.isNative)
        account.password = await this.app.$cypher.decrypt(
          account.password as string
        )
      else account.password = await dispatch("decryptAccount", account.password)

      return account
    },

    async encryptAccount(_store, account: Account): Promise<Account> {
      account.app = await this.app.$cypher.encrypt(account.app)
      if (account.isNative)
        account.password = await this.app.$cypher.encrypt(
          account.password as string
        )
      account.accountIdentifier =
        account.accountIdentifier &&
        (await this.app.$cypher.encrypt(account.accountIdentifier))
      account.site =
        account.site && (await this.app.$cypher.encrypt(account.site))
      account.note =
        account.note && (await this.app.$cypher.encrypt(account.note))
      return account
    },

    async updateLastUsed({ commit }, accountId: string) {
      await this.$axios.put(`/accounts/${accountId}/last-used`)
      commit("updateLastUsedCache", accountId)
    },

    async copy({ dispatch }, accountId: string) {
      // Get the account
      const acc = (await dispatch("getAccount", accountId)) as Account
      if (!acc || !acc.isNative) return
      // Update it's last used
      await dispatch("updateLastUsed", accountId)
      // Copy the account
      this.$copy(acc.password as string, "Copied password!")
    },

    async decryptAndSetAccounts({ commit, dispatch }, accounts: Account[]) {
      const dAccounts = await Promise.all(
        accounts.map(x => dispatch("decryptAccount", x))
      )
      commit("setAccounts", dAccounts)
    }
  }
)
