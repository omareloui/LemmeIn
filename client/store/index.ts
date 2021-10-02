import { getAccessorType, mutationTree, actionTree } from "typed-vuex"

// All store modules
import * as notify from "~/store/notify"
import * as confirm from "~/store/confirm"
import * as vault from "~/store/vault"
import * as tags from "~/store/tags"
import * as theme from "~/store/theme"
import * as auth from "~/store/auth"

export const state = () => ({})

export type RootState = ReturnType<typeof state>

export const mutations = mutationTree(state, {})

export const actions = actionTree(
  { state, mutations },
  {
    async nuxtServerInit({ dispatch }) {
      dispatch("theme/load")
      await dispatch("auth/setMe")
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
    tags
  }
})
