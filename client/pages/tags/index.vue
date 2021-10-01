 <template>
  <container has-padding-bottom class="tags-page">
    <template #heading>Tags</template>
    <input-search
      v-model="searchQuery"
      placeholder="Search tags..."
      class="search-input"
      @clear="searchQuery = ''"
    />

    <button-main large cta block class="add-button" @click="openAddTag"
      >Add new tag</button-main
    >

    <main>
      <transition-group name="tag" class="tags" tag="div">
        <tag
          v-for="tag in searchQuery ? searchResult : tags"
          :key="tag.id"
          class="tag"
          v-bind="{ tag }"
          @edit-tag="editTag"
        />
      </transition-group>
    </main>

    <dialogue :is-shown="isAddTagOpen" @close="closeAddTag">
      <tag-add @add-tag="addTag" @close-dialogue="closeAddTag" />
    </dialogue>
    <dialogue :is-shown="isEditTagOpen" @close="closeEditTag">
      <tag-edit
        :tag="tagToEdit"
        @add-tag="addTag"
        @close-dialogue="closeEditTag"
        @update-tag="updateTag"
        @remove-tag="removeTag"
      />
    </dialogue>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import Fuse from "fuse.js"
import type { Tag } from "~/@types"

export default Vue.extend({
  async asyncData({ $axios, error }) {
    try {
      const response = await $axios.get("/tags")
      const tags = response.data as Tag[]
      return { tags }
    } catch (e) {
      return error(e.response.data)
    }
  },

  computed: {
    searchResult(): Tag[] {
      // @ts-ignore
      const fuse = new Fuse<Tag>(this.tags, { keys: ["name"] })
      return fuse.search(this.searchQuery).map(x => x.item)
    }
  },

  data: () => ({
    searchQuery: "",
    isAddTagOpen: false,
    isEditTagOpen: false,
    tagToEdit: null as Tag | null
  }),

  methods: {
    closeDialogues() {
      this.closeAddTag()
      this.closeEditTag()
    },

    // Add tag
    addTag(tag: Tag) {
      // @ts-ignore
      this.tags.unshift(tag)
    },
    openAddTag() {
      this.closeDialogues()
      this.isAddTagOpen = true
    },
    closeAddTag() {
      this.isAddTagOpen = false
    },

    // Edit tag
    openEditTag() {
      this.closeDialogues()
      this.isEditTagOpen = true
    },
    closeEditTag() {
      this.isEditTagOpen = false
    },
    editTag(tag: Tag) {
      this.tagToEdit = tag
      this.openEditTag()
    },
    updateTag(newTag: Tag) {
      // @ts-ignore
      this.tags = this.tags.map(x => {
        if (x.id === newTag.id) x = newTag
        return x
      })
    },

    // Remote
    removeTag(tagToRemove: Tag) {
      // @ts-ignore
      this.tags = this.tags.filter(x => x.id !== tagToRemove.id)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.tags-page
  .search-input
    +my(20px)
    +lt-tablet
      +mx(min(100px, 5vw))

  main
    .tags
      +grid
      .tag
        &:not(:last-child)
          +mb(20px)
      +lt-tablet
        grid-template-columns: repeat(2, 1fr)
        .tag
          &:nth-child(even)
            +ml(20px)
          &:nth-last-child(2):nth-child(odd)
            +mb(0)

  .add-button
    +mb(20px)
    +mx(auto)
    +lt-tablet
      +w(max 300px)
</style>
