import Vue from "vue"
import type {NuxtCookies} from "cookie-universal-nuxt"
import { accessorType } from "~/store"

declare module "*.vue" {
  export default Vue
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $cookies: NuxtCookies
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $accessor: typeof accessorType
    $cookies: NuxtCookies
  }
}
