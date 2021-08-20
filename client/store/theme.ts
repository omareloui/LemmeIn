import { mutationTree, actionTree } from "typed-vuex"

type ThemeOption = "light" | "dark"

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
    async toggleTheme({ state, dispatch }) {
      const neededTheme = state.currentTheme === "dark" ? "light" : "dark"
      await dispatch("changeTheme", neededTheme)
    },

    async changeTheme({ commit, dispatch }, theme: ThemeOption) {
      await dispatch("applyTheme", theme)
      commit("setThemeState", theme)
      await dispatch("setThemeToCookie", theme)
    },

    async loadSetTheme({ dispatch }) {
      let cookie: ThemeOption
      cookie = await dispatch("getThemeFromCookie")
      if (!cookie) cookie = await dispatch("getThemeFromMediaQuery")
      await dispatch("changeTheme", cookie)
    },

    applyTheme(_vuexContext, theme: ThemeOption) {
      if (theme === "dark")
        return document.documentElement.setAttribute("theme", "dark")
      return document.documentElement.removeAttribute("theme")
    },

    setThemeToCookie({ state }, theme: ThemeOption) {
      this.app.$cookies.set(state.THEME_COOKIE_NAME, theme, {
        sameSite: "lax"
      })
    },

    getThemeFromCookie({ state }) {
      return this.app.$cookies.get(state.THEME_COOKIE_NAME)
    },

    getThemeFromMediaQuery() {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      )
        return "dark"
      return "light"
    }

    // listenForDefaultChange({dispatch}) {
    //   window
    //     .matchMedia("(prefers-color-scheme: dark)")
    //     .addEventListener("change", e => {
    //       const newColorScheme = e.matches ? "dark" : "light"
    //       // TODO: await dispatch("applyTheme", newColorScheme)
    //     })
    // }
  }
)
