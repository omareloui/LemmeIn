import { mutationTree, actionTree } from "typed-vuex"
import { Note, AddNote, UpdateNote } from "~/@types"

export const state = () => ({
  notes: [] as Note[]
})

export type NotesState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setNotes(state, notes: Note[]) {
    state.notes = notes
  },

  clearNotes(state) {
    state.notes = []
  },

  updateNoteCache(state, note: Note) {
    const noteIndex = state.notes.findIndex(x => x.id === note.id)
    if (noteIndex === -1) throw new Error("Can't find the note to update")
    state.notes[noteIndex] = note
  },

  unshiftToNotes(state, note: Note) {
    state.notes.unshift(note)
  },

  removeNote(state, noteId: string) {
    state.notes = state.notes.filter(x => x.id !== noteId)
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async getNotes({ commit }) {
      if (!this.app.$accessor.auth.isSigned) return
      const { data: notes } = (await this.$axios.get("/notes")) as {
        data: Note[]
      }
      commit("setNotes", notes)
    },

    async getNote({ state }, noteId: string) {
      const note = state.notes.find(x => x.id === noteId)
      if (note) return note
      const { data } = (await this.$axios.get(`/notes/${noteId}`)) as {
        data: Note
      }
      return data
    },

    async addNote({ commit }, options: AddNote) {
      try {
        if (!options.body && !options.title)
          throw new Error(`"note" and "title" can't be both empty`)
        const response = await this.$axios.post("/notes", options)
        const note = response.data as Note
        this.$notify.success("Created note")
        commit("unshiftToNotes", note)
        return true
      } catch (e) {
        // @ts-ignore
        this.$notify.error(e.response ? e.response.data.message : e.message)
        return false
      }
    },

    async updateNote({ commit }, options: UpdateNote) {
      try {
        const { id } = options
        delete options.id
        const response = await this.$axios.put(`/notes/${id}`, options)
        const newNote = response.data as Note
        this.$notify.success("Updated note")
        commit("updateNoteCache", newNote)
        return newNote
      } catch (e) {
        // @ts-ignore
        this.$notify.error(e.response ? e.response.data.message : e.message)
        return false
      }
    },

    async deleteNote({ commit }, noteId: string) {
      try {
        const confirmed = await this.$confirm(
          `Are you sure you want to delete this note?`,
          { acceptMessage: "Delete" }
        )
        if (!confirmed) return false
        await this.$axios.delete(`/notes/${noteId}`)
        commit("removeNote", noteId)
        this.$notify.success("Removed note.")
        return true
      } catch (e) {
        // @ts-ignore
        this.$notify.error(e.response ? e.response.data.message : e.message)
        return false
      }
    }
  }
)
