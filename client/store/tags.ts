import { mutationTree, actionTree } from "typed-vuex"
import { Tag, AddTag, UpdateTag } from "~/@types"
import getRandomColor from "~/assets/utils/getRandomTagColor"

export const state = () => ({
  tags: [] as Tag[]
})

export type TagsState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setTags(state, tags: Tag[]) {
    state.tags = tags
  },

  clearTags(state) {
    state.tags = []
  },

  updateTagCache(state, tag: Tag) {
    const tagIndex = state.tags.findIndex(x => x.id === tag.id)
    if (tagIndex === -1) throw new Error("Can't find the tag to update")
    state.tags[tagIndex] = tag
  },

  unshiftToTags(state, tag: Tag) {
    state.tags.unshift(tag)
  },

  removeTag(state, tagId: string) {
    state.tags = state.tags.filter(x => x.id !== tagId)
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async getTags({ commit }) {
      if (!this.app.$accessor.auth.isSigned) return
      const { data: tags } = (await this.$axios.get("/tags")) as { data: Tag[] }
      commit("setTags", tags)
    },

    async addTag({ commit }, { name, color }: AddTag) {
      try {
        if (!color) color = getRandomColor()
        const response = await this.$axios.post("/tags", { name, color })
        const tag = response.data as Tag
        this.$notify.success("Created tag.")
        commit("unshiftToTags", tag)
        return true
      } catch (e) {
        // @ts-ignore
        this.$notify.error(e.response ? e.response.data.message : e.message)
        return false
      }
    },

    async updateTag({ commit }, options: UpdateTag) {
      try {
        const { id } = options
        delete (options as { id?: string }).id
        const response = await this.$axios.put(`/tags/${id}`, options)
        const newTag = response.data as Tag
        this.$notify.success("Updated tag.")
        commit("updateTagCache", newTag)
        return true
      } catch (e) {
        // @ts-ignore
        this.$notify.error(e.response ? e.response.data.message : e.message)
        return false
      }
    },

    async deleteTag(
      { commit },
      { tagId, tagName }: { tagId: string; tagName: string }
    ) {
      try {
        const confirmed = await this.$confirm(
          `Are you sure you want to delete "${tagName}" tag?`,
          {
            description:
              "That will also remove the tag from all accounts and notes",
            acceptMessage: "Delete"
          }
        )
        if (!confirmed) return false
        await this.$axios.delete(`/tags/${tagId}`)
        commit("removeTag", tagId)
        this.app.$accessor.vault.removeTagFromAccounts(tagId)
        this.app.$accessor.notes.removeTagFromNotes(tagId)
        this.$notify.success("Removed tag.")
        return true
      } catch (e) {
        // @ts-ignore
        this.$notify.error(e.response ? e.response.data.message : e.message)
        return false
      }
    }
  }
)
