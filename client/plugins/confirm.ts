import { Plugin } from "@nuxt/types"
import type {ConfirmOptions} from "~/store/confirm"

type ConfirmFunction = (
  message: string,
  options?: Omit<ConfirmOptions, "message">
) => Promise<boolean>

declare module "vue/types/vue" {
  interface Vue {
    $confirm: ConfirmFunction
  }
}
declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $confirm: ConfirmFunction
  }
  interface Context {
    $confirm: ConfirmFunction
  }
}
declare module "vuex/types/index" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $confirm: ConfirmFunction
  }
}

const confirm: Plugin = ({ app, store }, inject) => {
  const showConfirmation: ConfirmFunction = async (message, options) => {
    // Show confirming message
    app.$accessor.confirm.showConfirm({ message, ...options })

    function waitTillClose() {
      return new Promise(res => {
        const unwatch = store.watch(
          state => state.confirm.isConfirming,
          newValue => {
            if (newValue === false) {
              unwatch()
              res(true)
            }
          }
        )
      })
    }
    await waitTillClose()

    // Return the result
    return app.$accessor.confirm.result
  }

  inject("confirm", showConfirmation)
}

export default confirm
