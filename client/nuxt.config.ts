import { NuxtConfig } from "@nuxt/types"

const nuxt: NuxtConfig = {
  target: "server",
  telemetry: false,

  head: {
    title: "MENNT Framework",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "MongoDB, Express, NodeJS, Nuxt and TypeScript framework."
      },
      { name: "color-scheme", content: "light dark" }
    ]
    // link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  router: {},
  css: [
    "~/assets/scss/core/index.scss",
    "~/assets/scss/variables/index.scss",
    "~/assets/scss/base/index.scss"
  ],
  plugins: [{ src: "~/plugins/notify", mode: "client" }],
  components: true,
  buildModules: ["@nuxt/typescript-build", "nuxt-typed-vuex"],
  build: { additionalExtensions: ["vue", "ts"] },
  ignore: ["**/*/__tests__/**/*", "**/*.spec.*", "**/*.test.*"],
  modules: ["@nuxtjs/axios", "cookie-universal-nuxt"],

  axios: {
    baseURL: "http://localhost:8000"
  }
}

export default nuxt
