import Vue, { VueConstructor } from "vue"

export type ExtendVue<T> = VueConstructor<Vue & T>
