import Vue, { VueConstructor } from "vue"

type ExtendVue<T> = VueConstructor<Vue & T>
export default ExtendVue
