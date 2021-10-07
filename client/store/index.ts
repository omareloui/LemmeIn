import { getAccessorType, mutationTree, actionTree } from "typed-vuex"

// All store modules
import * as notify from "~/store/notify"
import * as confirm from "~/store/confirm"
import * as vault from "~/store/vault"
import * as notes from "~/store/notes"
import * as tags from "~/store/tags"
import * as resources from "~/store/resources"
import * as theme from "~/store/theme"
import * as auth from "~/store/auth"

export const state = () => ({})

export type RootState = ReturnType<typeof state>

export const mutations = mutationTree(state, {})

export const actions = actionTree(
  { state, mutations },
  {
    async nuxtServerInit(_store, { req, redirect }) {
      const { $accessor } = this.app
      $accessor.theme.load()
      await $accessor.auth.setMe()
      await $accessor.resources.load()
      // Redirect to home if is signed in and going to /
      if (req.url === "/" && $accessor.auth.isSigned) redirect("/home")
    }
  }
)

export const accessorType = getAccessorType({
  state,
  mutations,
  actions,
  modules: {
    notify,
    confirm,
    theme,
    auth,
    vault,
    notes,
    tags,
    resources
  }
})
