import { mutationTree, actionTree } from "typed-vuex"
import { AddAccount, Account, UpdateAccount } from "~/@types"

export const state = () => ({
  accounts: [] as Account[]
})

export type AccountsState = ReturnType<typeof state>

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

  updateLastUsedToNow(state, accountId: string) {
    if (state.accounts.length === 0) return
    const account = state.accounts.find(x => x?.id === accountId)
    if (!account) throw new Error("Can't find the account to update last used")
    account.lastUsed = new Date()
  },

  removeAccount(state, accountId: string) {
    state.accounts = state.accounts.filter(x => x.id !== accountId)
  },

  cacheDecryption(
    state,
    { passId, decryptedPass }: { passId: string; decryptedPass: string }
  ) {
    const acc = state.accounts.find(x => x.id === passId)
    if (!acc) throw new Error("Can't find the account to update last used")
    if (acc.password)
      throw new Error("Can't update an oAuth account's decryption cache")
    acc.decryptedPassword = decryptedPass
  },

  updateAccountCache(state, account) {
    const accIndex = state.accounts.findIndex(x => x.id === account.id)
    if (accIndex === -1)
      throw new Error("Can't find the account to update last used")
    state.accounts[accIndex] = account
  },

  clearDecryptionsCache(state) {
    state.accounts.forEach(x => delete x.decryptedPassword)
  },

  removeTagFromAccounts(state, tagId: string) {
    state.accounts = state.accounts.map(acc => {
      if (acc.tags) acc.tags = acc.tags.filter(x => x.id !== tagId)
      return acc
    })
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async updateAccountsCache({ commit }) {
      const { data } = await this.$axios.get("/accounts")
      commit("setAccounts", data as Account[])
    },

    async getAccounts({ dispatch }) {
      if (!this.app.$accessor.auth.isSigned) return
      dispatch("updateAccountsCache")
    },

    async getAccount({ state, dispatch }, accountId: string): Promise<Account> {
      try {
        // Check first from cache
        let acc = state.accounts.find(x => x.id === accountId)

        // Get the password if not in cache
        if (!acc) {
          const { data: account } = await this.$axios.get(
            `/accounts/${accountId}`
          )
          acc = account
        }

        if (!acc) throw new Error("Can't find the account")

        // Decrypt the password if it's not decrypted
        if (!acc.password && !acc.decryptedPassword)
          acc.decryptedPassword = await dispatch("decryptPassword", accountId)
        return acc
      } catch (e) {
        // @ts-ignore
        return this.$notify.error(e.response.data.message)
      }
    },

    async addAccount({ commit }, options: AddAccount) {
      const response = await this.$axios.post("/accounts", options)
      const account = response.data as Account
      this.$notify.success("Created account.")
      commit("unshiftToAccounts", account)
    },

    async updateAccount({ commit }, options: UpdateAccount) {
      const { id } = options
      delete (options as { id?: string }).id
      const response = await this.$axios.put(`/accounts/${id}`, options)
      const newAccount = response.data as Account
      this.$notify.success("Updated account.")
      commit("updateAccountCache", {
        ...newAccount,
        decryptedPassword: !options.isOAuth ? options.password : undefined
      })
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
        commit("removeAccount", accountId)
        this.$notify.success("Deleted account successfully")
        if (goToVaultAfter) this.$router.push("/vault")
      } catch (e) {
        // @ts-ignore
        throw new Error(e.response.data.message)
      }
    },

    async decryptPassword(
      { state, commit },
      accountId: string
    ): Promise<string> {
      // Get the account
      try {
        // See if the decryption is cached
        const acc = state.accounts.find(x => x.id === accountId)
        if (acc && acc.decryptedPassword) return acc.decryptedPassword

        // If the account isn't cached
        let { data: decryptedPass } = await this.$axios.get(
          `/accounts/decrypt/${accountId}`
        )

        // Stringify it if it's a number
        decryptedPass = decryptedPass.toString()

        // Cache the account
        commit("cacheDecryption", { passId: accountId, decryptedPass })

        // Update the last used in accounts state
        commit("updateLastUsedToNow", accountId)
        return decryptedPass
      } catch (e) {
        // @ts-ignore
        return this.$notify.error(e.response.data.message)
      }
    },

    async copy({ dispatch }, accountId: string) {
      // Get the account
      const pass = await dispatch("decryptPassword", accountId)
      if (!pass) return
      // Copy the account
      this.$copy(pass, "Copied password!")
    }
  }
)
