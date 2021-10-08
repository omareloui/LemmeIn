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
        const { accounts, notes, tags, analyzes } = response.data as Resources

        await $accessor.vault.setAccounts(accounts)
        await $accessor.notes.setNotes(notes)
        await $accessor.tags.setTags(tags)
        await $accessor.analyze.setData(analyzes)
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
