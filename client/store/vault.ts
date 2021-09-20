import { mutationTree, actionTree } from "typed-vuex"
import { AddPassword, Password } from "~/@types"

export const state = () => ({
  gotPasswords: false,
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

  unshiftToPasswords(state, password: Password) {
    state.passwords.unshift(password)
  },

  updateLastUsedToNow(state, passwordId: string) {
    if (state.passwords.length === 0) return
    const password = state.passwords.find(x => x?.id === passwordId)
    if (!password)
      throw new Error("Can't find the password to update last used")
    password.lastUsed = new Date()
  },

  cacheDecryption(
    state,
    { passId, decryptedPass }: { passId: string; decryptedPass: string }
  ) {
    if (!state.gotPasswords) return
    const pass = state.passwords.find(x => x.id === passId)
    if (!pass) throw new Error("Can't find the password to update last used")
    if (pass.password)
      throw new Error("Can't update an oAuth password's decryption cache")
    pass.decryptedPassword = decryptedPass
  },

  clearDecryptionsCache(state) {
    state.passwords.forEach(x => delete x.decryptedPassword)
  },

  setGotPasswords(state, value = true) {
    state.gotPasswords = value
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async updatePasswords({ commit }) {
      const { data } = await this.$axios.get("/passwords")
      commit("setPasswords", data as Password[])
      commit("setGotPasswords")
    },

    async getPasswords({ state, dispatch }) {
      if (!this.app.$accessor.auth.isSigned || state.gotPasswords) return
      dispatch("updatePasswords")
    },

    async getPassword(
      { state, dispatch },
      passwordId: string
    ): Promise<Password> {
      try {
        let pass = state.passwords.find(x => x.id === passwordId)

        if (!pass) {
          const { data: password } = await this.$axios.get(
            `/passwords/${passwordId}`
          )
          pass = password
        }

        if (!pass) throw new Error("Can't find the password")

        if (!pass.password && !pass.decryptedPassword) {
          pass.decryptedPassword = await dispatch("decryptPassword", passwordId)
        }
        return pass
      } catch (e) {
        // @ts-ignore
        return this.$notify.error(e.response.data.message)
      }
    },

    async addPassword({ commit }, options: AddPassword) {
      const response = await this.$axios.post("/passwords", options)
      const password = response.data as Password
      this.$notify.success("Created password.")
      commit("unshiftToPasswords", password)
    },

    async decryptPassword(
      { state, commit },
      passwordId: string
    ): Promise<string> {
      // Get the password
      try {
        // See if the decryption is cached
        const pass = state.passwords.find(x => x.id === passwordId)
        if (pass && pass.decryptedPassword) return pass.decryptedPassword

        // If the password isn't cached
        const { data: decryptedPass } = await this.$axios.get(
          `/passwords/decrypt/${passwordId}`
        )

        // Cache the password
        commit("cacheDecryption", { passId: passwordId, decryptedPass })

        // Update the last used in passwords state
        commit("updateLastUsedToNow", passwordId)
        return decryptedPass.toString()
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
      this.$copy(password, "Copied password!")
    }
  }
)
