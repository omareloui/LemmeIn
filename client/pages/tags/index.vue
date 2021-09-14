 <template>
  <container has-padding-bottom>
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
      <div class="tags">
        <transition-group name="slide-down">
          <tag
            v-for="tag in searchResult"
            :key="tag.id"
            class="tag"
            v-bind="{ tag }"
            @edit-tag="editTag"
          />
        </transition-group>
      </div>
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
import type { Tag } from "~/@types"

export default Vue.extend({
  async asyncData({ $axios, error }) {
    try {
      const { data } = await $axios.get("/tags")
      return { tags: data as Tag[] }
    } catch (e) {
      return error(e.response.data)
    }
  },

  computed: {
    searchResult(): Tag[] {
      // @ts-ignore
      return (this.tags as Tag[]).filter(x => {
        const query = this.searchQuery.replace(/[*.+$^()[\]{}]/gi, "")
        return x.tag.match(new RegExp(query, "i"))
      })
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
      this.tags.push(tag)
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

.search-input
  +my(20px)
  +lt-tablet
    +mx(min(100px, 5vw))

.tags > *
  +grid($gap: 20px)
  +lt-tablet
    grid-template-columns: repeat(2, 1fr)

.add-button
  +mb(20px)
  +mx(auto)
  +lt-tablet
    +w(max 300px)
</style>
