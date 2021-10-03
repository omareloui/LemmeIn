import { mutationTree, actionTree } from "typed-vuex"

interface RegisterOptions {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface UpdateMeOptions extends Partial<RegisterOptions> {
  oldPassword?: string
}

interface SignInOptions {
  email: string
  password: string
}

interface User {
  id: string
  firstName: string
  lastName: string
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

    async register({ dispatch }, options: RegisterOptions) {
      const { data: result } = await this.$axios.post("/auth/register", options)
      dispatch("setSignData", result)
      this.$router.push("/")
    },

    async signin({ dispatch }, options: SignInOptions) {
      const { data: result } = await this.$axios.post("/auth/login", options)
      dispatch("setSignData", result)
      await this.app.$accessor.resources.load()
      this.$router.push("/")
    },

    async updateMe(
      { dispatch },
      { oldPassword, email, firstName, lastName, password }: UpdateMeOptions
    ) {
      const options: UpdateMeOptions = {}
      if (firstName) options.firstName = firstName
      if (lastName) options.lastName = lastName
      if (email) options.email = email
      if (password && oldPassword) {
        options.password = password
        options.oldPassword = oldPassword
      }
      const { data: result } = await this.$axios.put("/me", options)
      dispatch("setSignData", result)
      this.$notify.success("Update profile")
      this.$router.push("/")
    },

    async setMe({ commit, dispatch }) {
      if (!(await dispatch("getToken"))) return
      try {
        const { data: me } = await this.$axios.get("/me")
        commit("setUser", me)
        commit("updateIsSigned", true)
      } catch (e) {
        // @ts-ignore
        if (!e.response || e.response.data.status === 401) {
          dispatch("signOut")
          this.$router.push("/")
        }
      }
    },

    async signOut({ dispatch, commit }) {
      dispatch("removeToken")
      await this.app.$accessor.resources.clear()
      commit("setUser", null)
      commit("updateIsSigned", false)
    }
  }
)
