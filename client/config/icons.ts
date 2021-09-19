import { Icon } from "~/@types"

export const NO_ICON = "no-icon"

const icons = [
  // Social media
  { name: "facebook", color: "#1877f2", regex: /facebook|fb\.com/ },
  { name: "instagram", color: "#c92c8e", regex: /instagram/ },
  { name: "twitter", color: "#1da1f2", regex: /twitter|twt/ },
  { name: "whats-app", color: "#25d366", regex: /what'?s ?app/ },
  { name: "telegram", color: "#0088cc", regex: /telegram/ },
  { name: "messenger", color: "#0084ff", regex: /messeng[ea]r/ },
  { name: "tumblr", color: "#35465c", regex: /tumblr/ },
  { name: "discord", color: "#7289da", regex: /discord/ },
  { name: "reddit", color: "#ff4500", regex: /redd?it/ },
  { name: "tik-tok", color: ["#000000", "#ffffff"], regex: /tik.?tok/ },

  // Google stuff
  { name: "google-photos", color: "#fbbc05", regex: /google.photos/ },
  { name: "you-tube", color: "#ff0000", regex: /youtube/ },
  { name: "google", color: "#dd4b39", regex: /google|gmail|chrome/ },

  // Cloud
  { name: "one-drive", color: "#1590de", regex: /one.?drive/ },
  { name: "drop-box", color: "#007ee5", regex: /drop.?box/ },

  // Encyclopedias and publishing platforms
  { name: "wikipedia", color: ["#000000", "#ffffff"], regex: /wikipedia/ },
  { name: "medium", color: "#00ab6c", regex: /medium/ },

  // Designing and inspirations
  { name: "pinterest", color: "#e60023", regex: /pinterest/ },
  { name: "dribbble", color: "#ea4c89", regex: /dribbble/ },

  // Driving, delivering and stuff
  { name: "uber", color: ["#09091a", "#c0c0c8"], regex: /uber/ },

  // Password managers
  { name: "last-pass", color: "#d32d27", regex: /last ?pass/ },

  // Project managers
  { name: "trello", color: "#0079bf", regex: /trello/ },
  { name: "notion", color: ["#000000", "#ffffff"], regex: /notion/ },

  // Work stuff
  { name: "linked-in", color: "#0077b5", regex: /linked.?in/ },

  // Entertainment
  { name: "spotify", color: "#1db954", regex: /spotify/ },
  { name: "netflix", color: "#e50914", regex: /netflix/ },

  // Chess
  { name: "li-chess", color: ["#000000", "#eeeeee"], regex: /li.?chess/ },

  // Shopping
  { name: "amazon", color: "#ff9900", regex: /amazon|souq/ },

  // Development related
  // prettier-ignore
  { name: "github", color: ["#333", "#f5f5f5"], viewBox: "32 31.2", regex: /github/ },
  { name: "digital-ocean", color: "#008bcf", regex: /digital.?ocean/ },
  { name: "stack-overflow", color: "#f48024", regex: /stack.?overflow/ },

  // Technologies
  { name: "vue", color: "#42b883", regex: /vue/ },
  { name: "nuxt", color: "#2f495e", regex: /nuxt/ },

  // Hotels
  { name: "airbnb", color: "#fd5c63", regex: /airbnb/ },

  // Yearbook
  { name: "alsun-yearbook", color: ["#000000", "#ffee58"], regex: /alsun/ },

  // Default
  { name: NO_ICON, color: ["#0d0d0d", "#ffffff"], regex: /./ }
] as Icon[]

export default icons
