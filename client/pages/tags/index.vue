 <template>
  <container tag="main">
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

    <div v-for="tag in searchResult" :key="tag.id" class="tag">
      <tag :tag="tag" />
    </div>

    <dialogue :is-shown="isAddTagOpen" @close="closeAddTag">
      <tag-add @add-tag="addTag" @close-dialogue="closeAddTag" />
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
    isAddTagOpen: false
  }),

  methods: {
    addTag(tag: Tag) {
      // @ts-ignore
      this.tags.push(tag)
    },

    openAddTag() {
      this.isAddTagOpen = true
    },
    closeAddTag() {
      this.isAddTagOpen = false
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *

.search-input
  +my(20px)
  +lt-mobile
    +mx(5vw)

.add-button
  +mb(20px)
  +mx(auto)
  +lt-mobile
    +w(max 300px)
</style>
