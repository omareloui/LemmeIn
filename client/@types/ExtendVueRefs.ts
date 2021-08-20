import ExtendVue from "./ExtendVue"

type ExtendVueRefs<T> = ExtendVue<{ $refs: T }>
export default ExtendVueRefs
