import { Middleware } from "@nuxt/types"

const hasToBeNotSigned: Middleware = ({ redirect, app, $notify }) => {
  const { isSigned } = app.$accessor.auth

  if (!isSigned) {
    if (process.server) $notify.error("You have to signin to view that page")
    redirect(`/`)
  }
}

export default hasToBeNotSigned
