import { Middleware } from "@nuxt/types"

const protectMustNotBeSignedRoutes: Middleware = ({
  route,
  redirect,
  app,
  $notify
}) => {
  const isProtectedRoute = !!route.fullPath.match(/^\/sign(-up|in)/)
  const { isSigned } = app.$accessor.auth

  if (isProtectedRoute && isSigned) {
    if (!process.server) $notify.error("You're signed in already")
    redirect(`/`)
  }
}

export default protectMustNotBeSignedRoutes
