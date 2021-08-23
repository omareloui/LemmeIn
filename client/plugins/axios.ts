/* eslint-disable dot-notation */
import { Context } from "@nuxt/types"

export default async function axiosPlugin({ $axios, app }: Context) {
  $axios.onRequest(config => {
    const token = app.$cookies.get(app.$accessor.auth.AUTH_COOKIE_NAME)
    if (token) config.headers.common["Authorization"] = `Bearer ${token}`
  })
}
