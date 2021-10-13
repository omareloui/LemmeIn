import { mutationTree, actionTree } from "typed-vuex"
import { Resources } from "~/@types"

export const state = () => ({})

export const mutations = mutationTree(state, {})

export const actions = actionTree(
  { state, mutations },
  {
    async load(): Promise<void> {
      const { $accessor, $axios } = this.app
      if ($accessor.auth.isSigned) {
        const response = await $axios.get("/resources")
        const { accounts, notes, tags } = response.data as Resources

        await $accessor.vault.decryptAndSetAccounts(accounts)
        await $accessor.notes.decryptAndSetNotes(notes)
        await $accessor.tags.setTags(tags)
        await $accessor.analyze.init()
      }
    },

    clear(): void {
      this.app.$accessor.vault.clearAccounts()
      this.app.$accessor.tags.clearTags()
      this.app.$accessor.notes.clearNotes()
      this.app.$accessor.analyze.clearData()
    }
  }
)
