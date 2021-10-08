import { mutationTree, actionTree } from "typed-vuex"
import { Analyze, AnalyzeKeys, Account } from "~/@types"

type AccountsType = Omit<Account, "password">[]

export const state = () => ({
  duplicated: { counter: 0, accounts: [] as AccountsType },
  outdated: { counter: 0, accounts: [] as AccountsType },
  safe: { counter: 0, accounts: [] as AccountsType },
  okay: { counter: 0, accounts: [] as AccountsType },
  weak: { counter: 0, accounts: [] as AccountsType },
  compromised: { counter: 0, accounts: [] as AccountsType }
})

export type AnalyzeState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setData(state, data: Analyze) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(Object.keys(data) as AnalyzeKeys[]).forEach(key => {
      state[key] = data[key]
    })
  },

  clearData(state) {
    state.duplicated = { counter: 0, accounts: [] as AccountsType }
    state.outdated = { counter: 0, accounts: [] as AccountsType }
    state.safe = { counter: 0, accounts: [] as AccountsType }
    state.okay = { counter: 0, accounts: [] as AccountsType }
    state.weak = { counter: 0, accounts: [] as AccountsType }
    state.compromised = { counter: 0, accounts: [] as AccountsType }
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async init({ commit }) {
      const { data } = await this.$axios.get("/analyze")
      const analyzeResult = data as Analyze
      commit("setData", analyzeResult)
    }
  }
)
