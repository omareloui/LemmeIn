 <template>
  <container padding-bottom class="notes-page">
    <template #heading>Secure Notes</template>

    <input-search
      v-model="searchQuery"
      placeholder="Search notes..."
      class="search-input"
      search-keys="name"
      :search-elements="notes"
      @search-result="searchResult = $event"
      @clear="searchQuery = ''"
    />

    <button-main large cta block class="add-button" @click="openAddNote"
      >Add new note</button-main
    >

    <main>
      <transition-group name="note" class="notes" note="div">
        <note
          v-for="note in searchQuery ? searchResult : notes"
          :key="note.id"
          class="note"
          v-bind="{ note }"
          @edit-note="editNote"
        />
      </transition-group>
    </main>

    <dialogue :is-shown="isAddNoteOpen" @close="closeAddNote">
      <note-add @close-dialogue="closeAddNote" />
    </dialogue>
    <!-- <dialogue :is-shown="isEditNoteOpen" @close="closeEditNote">
      <note-edit :note="noteToEdit" @close-dialogue="closeEditNote" />
    </dialogue> -->
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import type { Note } from "~/@types"

export default Vue.extend({
  computed: {
    notes(): Note[] {
      return this.$accessor.notes.notes
    }
  },

  data() {
    return {
      searchQuery: (this.$route.query.search as string | undefined) || "",
      searchResult: [] as Note[],

      isAddNoteOpen: false,
      isEditNoteOpen: false,
      noteToEdit: null as Note | null
    }
  },

  methods: {
    closeDialogues() {
      this.closeAddNote()
      this.closeEditNote()
    },

    // Search
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    clearSearch() {
      this.setSearchQuery("")
    },

    // Add note
    openAddNote() {
      this.closeDialogues()
      this.isAddNoteOpen = true
    },
    closeAddNote() {
      this.isAddNoteOpen = false
    },

    // Edit note
    editNote(note: Note) {
      this.noteToEdit = note
      this.openEditNote()
    },
    openEditNote() {
      this.closeDialogues()
      this.isEditNoteOpen = true
    },
    closeEditNote() {
      this.isEditNoteOpen = false
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

.notes-page
  .search-input
    +my(20px)
    +lt-tablet
      +mx(min(100px, 5vw))

  main
    .notes
      +grid
      .note
        &:not(:last-child)
          +mb(20px)

  .add-button
    +mb(20px)
    +mx(auto)
    +lt-tablet
      +w(max 300px)
</style>
