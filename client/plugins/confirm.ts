import { Plugin } from "@nuxt/types"

type ConfirmFunction = (
  message: string,
  options?: { acceptMessage: string }
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
        store.watch(
          state => state.confirm.isConfirming,
          newValue => {
            if (newValue === false) res(true)
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
