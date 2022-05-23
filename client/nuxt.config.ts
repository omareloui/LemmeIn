import { NuxtConfig } from "@nuxt/types"

const nuxt: NuxtConfig = {
  target: "server",
  telemetry: false,

  server: {
    host: "0.0.0.0",
    port: 1111,
  },

  head: {
    title: "Lemme In",

    htmlAttrs: {
      lang: "en"
    },

    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Lemme in is an account/password manager app."
      },
      { name: "color-scheme", content: "light dark" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: true
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Be+Vietnam:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,300;1,400;1,500;1,600;1,700;1,800&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
      }
    ]
  },

  router: {
    middleware: ["protectMustBeSignedRoutes", "protectMustNotBeSignedRoutes"]
  },

  css: [
    "~/assets/scss/core/index.scss",
    "~/assets/scss/variables/index.scss",
    "~/assets/scss/base/index.scss",
    "~/assets/scss/utilities/index.scss"
  ],
  plugins: [
    { src: "~/plugins/axios" },
    { src: "~/plugins/cypher" },
    { src: "~/plugins/getPasswordStrength" },
    { src: "~/plugins/swiper", mode: "client" },
    { src: "~/plugins/notify", mode: "client" },
    { src: "~/plugins/copy", mode: "client" },
    { src: "~/plugins/confirm", mode: "client" }
  ],
  components: true,
  buildModules: ["@nuxt/typescript-build", "nuxt-typed-vuex", "@nuxtjs/moment"],
  build: { additionalExtensions: ["vue", "ts"] },
  ignore: ["**/*/__tests__/**/*", "**/*.spec.*", "**/*.test.*"],
  modules: ["@nuxtjs/axios", "cookie-universal-nuxt"],

  axios: {
    baseURL: "http://192.168.1.6:8000"
  }
}

export default nuxt
