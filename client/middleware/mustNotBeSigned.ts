import { Middleware } from "@nuxt/types"

const protectMustNotBeSignedRoutes: Middleware = ({
  redirect,
  app,
  $notify
}) => {
  const { isSigned } = app.$accessor.auth
  if (isSigned) {
    if (process.server) $notify.error("You're signed in already")
    redirect(`/`)
  }
}

export default protectMustNotBeSignedRoutes
