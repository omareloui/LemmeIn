import { mutationTree, actionTree } from "typed-vuex"

export const state = () => ({})

export const mutations = mutationTree(state, {})

export const actions = actionTree(
  { state, mutations },
  {
    async load(): Promise<void> {
      const { $accessor } = this.app
      if ($accessor.auth.isSigned) {
        await $accessor.vault.getAccounts()
        await $accessor.tags.getTags()
      }
    },

    clear(): void {
      this.app.$accessor.vault.clearAccounts()
      this.app.$accessor.tags.clearTags()
    }
  }
)
