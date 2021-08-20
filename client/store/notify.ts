import { mutationTree, actionTree } from "typed-vuex"

interface Notification {
  id: number
  isShown: boolean
  type: string
  message: string
  duration: number
}

export const state = () => ({
  transitionDuration: 500,
  idCounter: -1,
  defaultDuration: 2000,
  notifications: [] as Notification[]
})

export type NotifyState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  hide(state, notificationId) {
    const notification = state.notifications.find(x => x.id === notificationId)
    if (notification) notification.isShown = false
  },
  show(state, notificationId) {
    const notification = state.notifications.find(x => x.id === notificationId)
    if (notification) notification.isShown = true
  },

  push(state, notification) {
    state.notifications.push(notification)
  },
  pop(state, notificationId) {
    state.notifications = state.notifications.filter(
      x => x.id !== notificationId
    )
  },

  increaseId(state) {
    state.idCounter++
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    notify({ state, commit, dispatch }, { message, duration, type }) {
      const newNotification: Notification = {
        id: state.idCounter,
        isShown: false,
        message,
        duration: duration || state.defaultDuration,
        type
      }
      commit("increaseId")
      dispatch("add", newNotification)
      setTimeout(
        () => dispatch("close", newNotification.id),
        newNotification.duration
      )
    },

    add({ commit }, notification) {
      commit("push", notification)
      setTimeout(() => commit("show", notification.id), 0)
    },

    close({ state, commit }, notificationId) {
      commit("hide", notificationId)
      setTimeout(() => commit("pop", notificationId), state.transitionDuration)
    },

    error({ dispatch }, { message, duration }) {
      dispatch("notify", { message, duration, type: "error" })
    },
    warn({ dispatch }, { message, duration }) {
      dispatch("notify", { message, duration, type: "warn" })
    },
    info({ dispatch }, { message, duration }) {
      dispatch("notify", { message, duration, type: "info" })
    },
    success({ dispatch }, { message, duration }) {
      dispatch("notify", { message, duration, type: "success" })
    }
  }
)
