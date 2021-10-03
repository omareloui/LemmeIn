import { Middleware } from "@nuxt/types"

const protectMustBeSignedRoutes: Middleware = ({
  route,
  redirect,
  app,
  $notify
}) => {
  const isProtectedRoute = !!route.fullPath.match(/^\/(vault|tags|settings)/)
  const { isSigned } = app.$accessor.auth

  if (isProtectedRoute && !isSigned) {
    if (!process.server) $notify.error("You have to signin to view that page")
    redirect(`/`)
  }
}

export default protectMustBeSignedRoutes
