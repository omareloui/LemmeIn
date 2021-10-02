import { Plugin } from "@nuxt/types"

type CopyFunction = (textToCopy: string, successMessage?: string) => void

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
  function copy(textToCopy: string, successMessage?: string): void {
    navigator.clipboard.writeText(textToCopy)
    $notify.success(successMessage || "Copied!")
  }

  inject("copy", copy)
}

export default copyPlugin
