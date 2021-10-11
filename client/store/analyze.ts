import { mutationTree, actionTree } from "typed-vuex"
import { Analyze, AnalyzeKeys, Account, PasswordStrengthValues } from "~/@types"
import getDatePrevMonths from "~/assets/utils/getDatePrevMonths"

type AccountsType = Omit<Account, "password">[]

export const state = () => ({
  duplicated: { counter: 0, accounts: [] as AccountsType },
  outdated: { counter: 0, accounts: [] as AccountsType },
  safe: { counter: 0, accounts: [] as AccountsType },
  okay: { counter: 0, accounts: [] as AccountsType },
  weak: { counter: 0, accounts: [] as AccountsType },
  compromised: { counter: 0, accounts: [] as AccountsType },
  totalAccounts: 0,
  score: 0,

  MAX_OUTDATED_MONTHS: 3
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
  },

  setAccountStrength(
    state,
    {
      account,
      strength
    }: { account: Account; strength: PasswordStrengthValues }
  ) {
    if (!account.decryptedPassword || account.password) return
    const wantedStateStrength = state[strength]
    wantedStateStrength.accounts.push(account)
    wantedStateStrength.counter++
    state.totalAccounts++
  },

  setAsOutdated(state, account: Account) {
    const { outdated } = state
    outdated.accounts.push(account)
    outdated.counter++
  },

  setAsDuplicated(state, account: Account) {
    const { duplicated } = state
    duplicated.accounts.push(account)
    duplicated.counter++
  },

  setScore(state, score: number) {
    if (score >= 0 && score <= 100) state.score = score
  },

  removeFromAll(
    state,
    {
      account,
      strength
    }: { account: Account; strength: PasswordStrengthValues }
  ) {
    // Remove from its strength
    const wantedState = state[strength]
    const passwordIndexToRemove = wantedState.accounts.findIndex(
      x => x.id === account.id
    )
    if (passwordIndexToRemove > -1) {
      wantedState.accounts.splice(passwordIndexToRemove, 1)
      wantedState.counter--
    }

    // Remove from total counter
    state.totalAccounts--

    // Remove from duplicates
    state.duplicated.accounts = state.duplicated.accounts.filter(
      x => x.id !== account.id
    )
    state.duplicated.counter = state.duplicated.accounts.length

    // Remove from outdated
    state.outdated.accounts = state.outdated.accounts.filter(
      x => x.id !== account.id
    )
    state.outdated.counter = state.outdated.accounts.length
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async init({ commit }) {
      const { data } = await this.$axios.get("/analyze")
      const analyzeResult = data as Analyze
      commit("setData", analyzeResult)
    },

    recalculateScore({ state, commit }) {
      const { safe, okay, weak, compromised, outdated, duplicated } = state
      let totalScore = 0

      const safeLength = safe.accounts.length
      const okayLength = okay.accounts.length
      const weakLength = weak.accounts.length
      const compromisedLength = compromised.accounts.length

      const nonOAuthAccountsTotal =
        safeLength + okayLength + weakLength + compromisedLength

      // Each account could be only one of these
      totalScore += safeLength
      totalScore += okayLength * 0.75
      totalScore += weakLength * 0.5
      totalScore += compromisedLength * 0

      // But there are sub categories the account could have it with any other
      // strength value
      totalScore -= outdated.accounts.length * 0.5
      totalScore -= duplicated.accounts.length * 0.5

      commit("setScore", Math.floor((totalScore / nonOAuthAccountsTotal) * 100))
    },

    analyzeAccount({ state, commit, dispatch }, account: Account) {
      if (!account.decryptedPassword) return
      // Set its strength
      const strength = this.$getPasswordStrength(account.decryptedPassword)
      commit("setAccountStrength", { account, strength: strength.value })

      // Set if it's outdated
      const maxOldDate = getDatePrevMonths(state.MAX_OUTDATED_MONTHS)
      if (account.lastPasswordUpdate < maxOldDate)
        commit("setAsOutdated", account)

      // Set if duplicated
      const duplicatedWith = this.app.$accessor.vault.accounts.find(
        x =>
          x.decryptedPassword &&
          x.decryptedPassword === account.decryptedPassword
      )
      if (duplicatedWith) commit("setAsDuplicated", account)

      // Recalculate the score
      dispatch("recalculateScore")
    },

    removeAccount({ commit, dispatch }, account: Account) {
      if (!account.decryptedPassword) return
      const strength = this.$getPasswordStrength(account.decryptedPassword)
      commit("removeFromAll", { account, strength: strength.value })
      dispatch("recalculateScore")
    }
  }
)
