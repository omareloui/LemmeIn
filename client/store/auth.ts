import { mutationTree, actionTree } from "typed-vuex"

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface Token {
  token: string
  expires: Date
}

export const state = () => ({
  AUTH_COOKIE_NAME: "auth",
  user: null as User | null,
  isSigned: false
})

export type AuthState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setUser(state, user: User | null) {
    state.user = user
  },

  updateIsSigned(state, isSigned: boolean) {
    state.isSigned = isSigned
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    getToken({ state }) {
      return this.$cookies.get(state.AUTH_COOKIE_NAME)
    },

    setToken({ state }, token: Token) {
      const expires =
        typeof token.expires === "string"
          ? new Date(token.expires)
          : token.expires
      this.app.$cookies.set(state.AUTH_COOKIE_NAME, token.token, {
        sameSite: "lax",
        path: "/",
        expires
      })
    },

    removeToken({ state }) {
      this.app.$cookies.remove(state.AUTH_COOKIE_NAME)
    },

    setSignData(
      { commit, dispatch },
      { user, token }: { user: User; token: Token }
    ) {
      dispatch("setToken", token)
      commit("updateIsSigned", true)
      commit("setUser", user)
    },

    async setMe({ commit, dispatch }) {
      if (!(await dispatch("getToken"))) return
      try {
        const { data: me } = await this.$axios.get("/me")
        commit("setUser", me)
        commit("updateIsSigned", true)
      } catch (e) {
        // @ts-ignore
        if (e.response.data.status === 401) {
          dispatch("signOut")
          this.$router.push("/")
        }
      }
    },

    signOut({ dispatch, commit }) {
      dispatch("removeToken")
      commit("setUser", null)
      commit("updateIsSigned", false)
    }
  }
)
