import { ExtendVue } from "./ExtendVue"

export type ExtendVueRefs<T> = ExtendVue<{ $refs: T }>
