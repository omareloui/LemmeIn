import { mutationTree, actionTree } from "typed-vuex"

type ThemeOption = "light" | "dark" | "default"

export const state = () => ({
  THEME_COOKIE_NAME: "theme",
  currentTheme: "light" as ThemeOption
})

export type ThemeState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setThemeState(state, value: ThemeOption) {
    state.currentTheme = value
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    load({ dispatch }) {
      dispatch("loadSetTheme")
    },

    loadMediaQuery({ dispatch }) {
      dispatch("setFromMediaQueryIfNeeded")
      dispatch("listenForDefaultChange")
    },

    toggleTheme({ state, dispatch }) {
      const neededTheme = state.currentTheme === "dark" ? "light" : "dark"
      dispatch("changeTheme", neededTheme)
    },

    async changeTheme({ commit, dispatch }, theme: ThemeOption) {
      commit("setThemeState", theme)
      dispatch("setThemeToCookie", theme)
    },

    async loadSetTheme({ dispatch }) {
      const cookie = await dispatch("getThemeFromCookie")
      dispatch("changeTheme", cookie)
    },

    setThemeToCookie({ state }, theme: ThemeOption) {
      this.app.$cookies.set(state.THEME_COOKIE_NAME, theme, {
        sameSite: "lax",
        path: "/"
      })
    },

    getThemeFromCookie({ state }) {
      let theme = this.app.$cookies.get(state.THEME_COOKIE_NAME)
      if (!theme) theme = "default"
      return theme
    },

    async setFromMediaQueryIfNeeded({ state, dispatch }) {
      if (state.currentTheme === "default") {
        const theme = await dispatch("getThemeFromMediaQuery")
        dispatch("changeTheme", theme)
      }
    },

    getThemeFromMediaQuery() {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      )
        return "dark"
      return "light"
    },

    listenForDefaultChange({ dispatch }) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", e => {
          dispatch("changeTheme", e.matches ? "dark" : "light")
        })
    }
  }
)
