import { mutationTree, actionTree } from "typed-vuex"
import { AddPassword, Password } from "~/@types"

export const state = () => ({
  passwords: [] as Password[]
})

export type PasswordsState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setPasswords(state, passwords) {
    state.passwords = passwords
  },

  clearPasswords(state) {
    state.passwords = []
  },

  pushToPasswords(state, password: Password) {
    state.passwords.push(password)
  },

  unshiftToPasswords(state, password: Password) {
    state.passwords.unshift(password)
  },

  updateLastUsedToNow(state, passwordId: string) {
    if (state.passwords.length === 0) return
    const password = state.passwords.find(x => x?.id === passwordId)
    if (!password)
      throw new Error("Can't find the password to update last used")
    password.lastUsed = new Date()
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async updatePasswords({ commit }) {
      const { data } = await this.$axios.get("/passwords")
      commit("setPasswords", data as Password[])
    },

    async getPasswords({ state, dispatch }) {
      if (!this.app.$accessor.auth.isSigned || state.passwords.length > 0)
        return
      dispatch("updatePasswords")
    },

    async addPassword({ commit }, options: AddPassword) {
      const response = await this.$axios.post("/passwords", options)
      const password = response.data as Password
      this.$notify.success("Created password.")
      commit("unshiftToPasswords", password)
    },

    async decryptPassword({ commit }, passwordId: string) {
      // Get the password
      try {
        const { data: password } = await this.$axios.get(
          `/passwords/decrypt/${passwordId}`
        )
        // Update the last used in passwords state
        commit("updateLastUsedToNow", passwordId)
        return password.toString() as string
      } catch (e) {
        // @ts-ignore
        return this.$notify.error(e.response.data.message)
      }
    },

    async copy({ dispatch }, passwordId: string) {
      // Get the password
      const password = await dispatch("decryptPassword", passwordId)
      if (!password) return
      // Copy the password
      this.$copy(password)
    }
  }
)
