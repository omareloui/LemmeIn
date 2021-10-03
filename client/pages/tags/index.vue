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
      <tag-add @close-dialogue="closeAddTag" />
    </dialogue>
    <dialogue :is-shown="isEditTagOpen" @close="closeEditTag">
      <tag-edit :tag="tagToEdit" @close-dialogue="closeEditTag" />
    </dialogue>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import Fuse from "fuse.js"
import type { Tag } from "~/@types"

export default Vue.extend({
  computed: {
    tags(): Tag[] {
      return this.$accessor.tags.tags
    },

    searchResult(): Tag[] {
      // @ts-ignore
      const fuse = new Fuse<Tag>(this.tags, { keys: ["name"] })
      return fuse.search(this.searchQuery).map(x => x.item)
    }
  },

  data() {
    return {
      searchQuery: (this.$route.query.search as string | undefined) || "",
      isAddTagOpen: false,
      isEditTagOpen: false,
      tagToEdit: null as Tag | null
    }
  },

  methods: {
    closeDialogues() {
      this.closeAddTag()
      this.closeEditTag()
    },

    // Search
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    clearSearch() {
      this.setSearchQuery("")
    },

    // Add tag
    openAddTag() {
      this.closeDialogues()
      this.isAddTagOpen = true
    },
    closeAddTag() {
      this.isAddTagOpen = false
    },

    // Edit tag
    editTag(tag: Tag) {
      this.tagToEdit = tag
      this.openEditTag()
    },
    openEditTag() {
      this.closeDialogues()
      this.isEditTagOpen = true
    },
    closeEditTag() {
      this.isEditTagOpen = false
    }
  },

  watch: {
    searchQuery(newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: Record<string, any> = { ...this.$route.query }
      if (newValue) query.search = newValue
      else delete query.search
      this.$router.push({
        path: this.$route.path,
        query
      })
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
