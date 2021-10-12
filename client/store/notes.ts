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
  },

  removeTagFromNotes(state, tagId: string) {
    state.notes = state.notes.map(note => {
      if (note.tags) note.tags = note.tags.filter(x => x.id !== tagId)
      return note
    })
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async getNotes({ dispatch }) {
      if (!this.app.$accessor.auth.isSigned) return
      const { data: notes } = (await this.$axios.get("/notes")) as {
        data: Note[]
      }
      dispatch("decryptAndSetNotes", notes)
    },

    async getNote({ state, dispatch }, noteId: string) {
      const note = state.notes.find(x => x.id === noteId)
      if (note) return note
      const { data } = await this.$axios.get(`/notes/${noteId}`)
      const dNote = await dispatch("decryptNote", data)
      return dNote
    },

    async addNote({ commit, dispatch }, options: AddNote) {
      try {
        if (!options.body && !options.title)
          throw new Error(`"note" and "title" can't be both empty`)
        const eNote = await dispatch("encryptNote", { ...options })
        const response = await this.$axios.post("/notes", eNote)
        const note = response.data as Note
        note.title = options.title
        note.body = options.body
        this.$notify.success("Created note")
        commit("unshiftToNotes", note)
        return true
      } catch (e) {
        this.$notify.error(e.response ? e.response.data.message : e.message)
        return false
      }
    },

    async updateNote({ commit, dispatch }, options: UpdateNote) {
      try {
        const { id } = options
        delete options.id
        const dNote = await dispatch("encryptNote", { ...options })
        const response = await this.$axios.put(`/notes/${id}`, dNote)
        const newNote = response.data as Note
        this.$notify.success("Updated note")
        commit("updateNoteCache", {
          ...newNote,
          body: options.body,
          title: options.title
        })
        return options as Note
      } catch (e) {
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
        this.$notify.error(e.response ? e.response.data.message : e.message)
        return false
      }
    },

    async encryptNote(_store, note: Note) {
      const { title, body } = note
      note.title = title ? await this.$cypher.encrypt(title) : ""
      note.body = body ? await this.$cypher.encrypt(body) : ""
      return note
    },

    async decryptNote(_store, note: Note) {
      const { title, body } = note
      note.title = title ? await this.$cypher.decrypt(title) : title
      note.body = body ? await this.$cypher.decrypt(body) : body
      return note
    },

    async decryptAndSetNotes({ commit, dispatch }, notes: Note[]) {
      const dNotes = await Promise.all(
        notes.map(x => dispatch("decryptNote", x))
      )
      commit("setNotes", dNotes)
    }
  }
)
