import { Password } from "~/@types"
import icons, { NO_ICON } from "~/config/icons"

export default function getIcon(password: Password) {
  const noIcon = icons.find(x => x.name === NO_ICON)
  let icon = icons
    .filter(x => x.name !== NO_ICON)
    .find(x => {
      const regex = new RegExp(x.regex, "i")
      let hasMatched = false
      hasMatched = !!(password.site && password.site.match(regex))
      if (!hasMatched) hasMatched = !!password.app.match(regex)
      return hasMatched
    })

  if (!icon) icon = noIcon
  return icon
}
