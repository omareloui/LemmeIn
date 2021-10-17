import { Plugin } from "@nuxt/types"

type CopyFunction = (
  textToCopy: string,
  successMessage?: string
) => Promise<void>

declare module "vue/types/vue" {
  interface Vue {
    $copy: CopyFunction
  }
}
declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $copy: CopyFunction
  }
  interface Context {
    $copy: CopyFunction
  }
}
declare module "vuex/types/index" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $copy: CopyFunction
  }
}

const copyPlugin: Plugin = ({ $notify }, inject) => {
  const copy: CopyFunction = async (textToCopy, successMessage) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      $notify.success(successMessage || "Copied!")
    } catch (e) {
      $notify.error("Couldn't copy for unknown reason, try again later")
    }
  }

  inject("copy", copy)
}

export default copyPlugin
