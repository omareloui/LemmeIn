import { Plugin } from "@nuxt/types"
import CryptoJS from "crypto-js"

class CypherHelper {
  constructor(private getKey: () => Promise<string | null>) {}

  async encrypt(content: string) {
    const { getKey } = this
    const key = await getKey()
    if (!key) throw new Error("No key provided")
    return CryptoJS.AES.encrypt(content, key).toString()
  }

  async decrypt(encryption: string) {
    const { getKey } = this
    const key = await getKey()
    if (!key) throw new Error("No key provided")
    const decryptedBytes = CryptoJS.AES.decrypt(encryption, key)
    return decryptedBytes.toString(CryptoJS.enc.Utf8)
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $cypher: CypherHelper
  }
}
declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $cypher: CypherHelper
  }
  interface Context {
    $cypher: CypherHelper
  }
}
declare module "vuex/types/index" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $cypher: CypherHelper
  }
}

const cypher: Plugin = async ({ app }, inject) => {
  const cypher = new CypherHelper(
    (app.$accessor.auth.getKey as unknown) as () => Promise<string | null>
  )
  inject("cypher", cypher)
}

export default cypher
