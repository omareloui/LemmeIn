import { mutationTree, actionTree, getterTree } from "typed-vuex"

export const state = () => ({
  DEFAULT_ACCEPT_MESSAGE: "Accept",
  message: "",
  acceptMessage: "",
  isConfirming: false,
  lastConfirmResult: false
})

export type ConfirmState = ReturnType<typeof state>

export const getters = getterTree(state, {
  result: state => !!state.lastConfirmResult
})

export const mutations = mutationTree(state, {
  show(state) {
    state.isConfirming = true
  },

  closeDialogue(state) {
    state.isConfirming = false
  },

  setMessage(state, { message, acceptMessage }) {
    state.message = message
    state.acceptMessage = acceptMessage || state.DEFAULT_ACCEPT_MESSAGE
  },

  removeMessage(state) {
    state.message = ""
    state.acceptMessage = state.DEFAULT_ACCEPT_MESSAGE
  },

  setSelected(state, selected) {
    state.lastConfirmResult = selected
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    showConfirm({ commit }, { message, acceptMessage }) {
      commit("setMessage", { message, acceptMessage })
      commit("show")
    },

    select({ commit, dispatch }, selected: boolean) {
      commit("setSelected", selected)
      dispatch("close")
    },

    close({ commit }) {
      commit("closeDialogue")
      setTimeout(() => {
        commit("removeMessage")
      }, 500)
    }
  }
)
