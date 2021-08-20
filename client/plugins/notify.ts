import { Plugin } from "@nuxt/types"

type NotifyFn = (message: string, options?: { duration?: number }) => void
export interface Notify {
  error: NotifyFn
  warn: NotifyFn
  info: NotifyFn
  success: NotifyFn
}

declare module "vue/types/vue" {
  interface Vue {
    $notify: Notify
  }
}
declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $notify: Notify
  }
  interface Context {
    $notify: Notify
  }
}
declare module "vuex/types/index" {
  interface Store<S> {
    $notify: Notify
  }
}

const notify: Plugin = ({ store }, inject) => {
  const notifications: Notify = {
    error(message, options) {
      store.dispatch("notify/error", { message, duration: options?.duration })
    },
    warn(message, options) {
      store.dispatch("notify/warn", { message, duration: options?.duration })
    },
    info(message, options) {
      store.dispatch("notify/info", { message, duration: options?.duration })
    },
    success(message, options) {
      store.dispatch("notify/success", { message, duration: options?.duration })
    }
  }

  inject("notify", notifications)
}

export default notify
