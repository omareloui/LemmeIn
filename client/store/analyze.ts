import { mutationTree, actionTree } from "typed-vuex"
import {
  Analyze,
  AnalyzeKeys,
  Account,
  BuildAnalyzesOptions,
  DuplicatedPasswords,
  PasswordStrengthValues
} from "~/@types"
import getDatePrevMonths from "~/assets/utils/getDatePrevMonths"

export const state = () => ({
  duplicated: { counter: 0, accounts: [] as Account[] },
  outdated: { counter: 0, accounts: [] as Account[] },
  safe: { counter: 0, accounts: [] as Account[] },
  okay: { counter: 0, accounts: [] as Account[] },
  weak: { counter: 0, accounts: [] as Account[] },
  compromised: { counter: 0, accounts: [] as Account[] },
  totalAccounts: 0,
  score: 0,

  MAX_OUTDATED_MONTHS: 3
})

export type AnalyzeState = ReturnType<typeof state>

export const mutations = mutationTree(state, {
  setData(state, data: Omit<Analyze, "score">) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(Object.keys(data) as AnalyzeKeys[]).forEach(key => {
      state[key] = data[key]
    })
  },

  clearData(state) {
    state.duplicated = { counter: 0, accounts: [] as Account[] }
    state.outdated = { counter: 0, accounts: [] as Account[] }
    state.safe = { counter: 0, accounts: [] as Account[] }
    state.okay = { counter: 0, accounts: [] as Account[] }
    state.weak = { counter: 0, accounts: [] as Account[] }
    state.compromised = { counter: 0, accounts: [] as Account[] }
  },

  setAccountStrength(
    state,
    {
      account,
      strength
    }: { account: Account; strength: PasswordStrengthValues }
  ) {
    if (!account.isNative) return
    const wantedStateStrength = state[strength]
    wantedStateStrength.accounts.push(account)
    wantedStateStrength.counter++
    state.totalAccounts++
  },

  updateAccountStrength(
    state,
    {
      account,
      oldStrength,
      strength
    }: {
      account: Account
      oldStrength: PasswordStrengthValues
      strength: PasswordStrengthValues
    }
  ) {
    if (!account.isNative || oldStrength === strength) return
    // Remove from the old strength
    state[oldStrength].accounts = state[oldStrength].accounts.filter(
      x => x.id !== account.id
    )
    state[oldStrength].counter--
    // Add to the new strength
    state[strength].accounts.push(account)
    state[strength].counter++
  },

  setAsOutdated(state, account: Account) {
    const { outdated } = state
    outdated.accounts.push(account)
    outdated.counter++
  },

  setAsDuplicated(
    state,
    { account, duplicatedWith }: { account: Account; duplicatedWith: Account }
  ) {
    const { duplicated } = state
    const alreadyExistingDuplication = duplicated.accounts.find(
      x => x.id === duplicatedWith.id
    )
    if (!alreadyExistingDuplication) {
      duplicated.accounts.push(duplicatedWith)
      duplicated.counter++
    }
    duplicated.accounts.push(account)
    duplicated.counter++
  },

  setScore(state, score: number) {
    if (score >= 0 && score <= 100) state.score = score
  },

  removeFromStrength(
    state,
    {
      account,
      strength
    }: { account: Account; strength: PasswordStrengthValues }
  ) {
    // Remove from its strength
    const wantedState = state[strength]
    const accountIndexToRemove = wantedState.accounts.findIndex(
      x => x.id === account.id
    )
    if (accountIndexToRemove > -1) {
      wantedState.accounts.splice(accountIndexToRemove, 1)
      wantedState.counter--
    }

    // Remove from total counter
    state.totalAccounts--
  },

  removeFromOutdated(state, account: Account) {
    const accountIndexToRemove = state.outdated.accounts.findIndex(
      x => x.id === account.id
    )
    if (accountIndexToRemove > -1) {
      state.outdated.accounts.splice(accountIndexToRemove, 1)
      state.outdated.counter--
    }
  },

  removeFromDuplicated(state, account: Account) {
    const accountToRemove = state.duplicated.accounts.find(
      x => x.id === account.id
    )
    if (accountToRemove) {
      const allSamePasswordAccounts = state.duplicated.accounts.filter(
        x => x.password === accountToRemove.password
      )

      // Remove the only provided account if it's duplicated with more than one account
      if (allSamePasswordAccounts.length > 2) {
        state.duplicated.accounts = state.duplicated.accounts.filter(
          x => x.id !== account.id
        )
        state.duplicated.counter--
      }

      // Remove both if they're only the duplicated
      if (allSamePasswordAccounts.length === 2) {
        state.duplicated.accounts = state.duplicated.accounts.filter(
          x => x.password !== accountToRemove.password
        )
        state.duplicated.counter -= 2
      }
    }
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    async init({ state, commit, dispatch }) {
      const { accounts } = this.app.$accessor.vault
      const analyzed = {
        compromised: [],
        okay: [],
        safe: [],
        weak: [],
        duplicated: [],
        outdated: [],
        totalAccounts: accounts.length
      } as BuildAnalyzesOptions

      const nativeAccounts = accounts.filter(x => x.isNative)

      const duplications = (await dispatch(
        "setDuplicatedPasswords",
        nativeAccounts
      )) as DuplicatedPasswords

      const checkIfDuplicated = (account: Account) =>
        duplications[account.password as string].passwordsId.length > 1
      const checkIfOutdated = (account: Account) =>
        Number(account.lastPasswordUpdate) <=
        Number(getDatePrevMonths(state.MAX_OUTDATED_MONTHS))

      const checkForStrength = (
        account: Account,
        strength: PasswordStrengthValues
      ) =>
        this.app.$getPasswordStrength(account.password as string).value ===
        strength

      const checkIfSafe = (account: Account) =>
        checkForStrength(account, "safe")
      const checkIfOkay = (account: Account) =>
        checkForStrength(account, "okay")
      const checkIfWeak = (account: Account) =>
        checkForStrength(account, "weak")
      const checkIfCompromised = (account: Account) =>
        checkForStrength(account, "compromised")

      analyzed.duplicated = nativeAccounts.filter(checkIfDuplicated)
      analyzed.outdated = nativeAccounts.filter(checkIfOutdated)

      analyzed.safe = nativeAccounts.filter(checkIfSafe)
      analyzed.okay = nativeAccounts.filter(checkIfOkay)
      analyzed.weak = nativeAccounts.filter(checkIfWeak)
      analyzed.compromised = nativeAccounts.filter(checkIfCompromised)

      const analyzeResult = (await dispatch("buildResult", analyzed)) as Omit<
        Analyze,
        "score"
      >
      commit("setData", analyzeResult)
      dispatch("calculateScore")
    },

    setDuplicatedPasswords(_store, accounts: Account[]) {
      const setDuplicatedPasswords = (
        prev: DuplicatedPasswords,
        cur: Account
      ) => {
        if (!cur.isNative) return prev
        const pass = cur.password as string
        const currentPasswordsIds = prev[pass]?.passwordsId
        prev[pass] = {
          passwordsId: currentPasswordsIds
            ? [...currentPasswordsIds, cur.id.toString()]
            : [cur.id.toString()]
        }
        return prev
      }
      return accounts.reduce(setDuplicatedPasswords, {})
    },

    calculateScore({ state, commit }) {
      const { safe, okay, weak, compromised, outdated, duplicated } = state
      let totalScore = 0
      const safeLength = safe.counter
      const okayLength = okay.counter
      const weakLength = weak.counter
      const compromisedLength = compromised.counter
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

    addAccount({ state, commit, dispatch }, account: Account) {
      if (!account.isNative) return
      // Set its strength
      const pass = account.password as string
      const strength = this.$getPasswordStrength(pass).value
      commit("setAccountStrength", { account, strength })
      // Set if it's outdated
      const maxOldDate = getDatePrevMonths(state.MAX_OUTDATED_MONTHS)
      if (account.lastPasswordUpdate < maxOldDate)
        commit("setAsOutdated", account)
      // Set if duplicated
      const duplicatedWith = this.app.$accessor.vault.accounts.find(
        x =>
          x.isNative && x.id !== account.id && x.password === account.password
      )
      if (duplicatedWith) commit("setAsDuplicated", { account, duplicatedWith })
      // Recalculate the score
      dispatch("calculateScore")
    },

    editAccount({ state, commit, dispatch }, account: Account) {
      if (!account.isNative) {
        dispatch("removeFromAllWithId", account.id)
        return
      }
      const findAccount = (x: Account) => x.id === account.id
      // Get the account and its old strength
      let oldStrength = "safe" as PasswordStrengthValues
      let oldAccount = state.safe.accounts.find(findAccount)
      if (!oldAccount) {
        oldAccount = state.okay.accounts.find(findAccount)
        oldStrength = "okay"
      }
      if (!oldAccount) {
        oldAccount = state.weak.accounts.find(findAccount)
        oldStrength = "weak"
      }
      if (!oldAccount) {
        oldAccount = state.compromised.accounts.find(findAccount)
        oldStrength = "compromised"
      }

      // Update its strength
      const strength = this.$getPasswordStrength(account.password as string)
      // If there wasn't an old account (meaning it changed from oAuth to native)
      //  then add it as a new one
      if (!oldAccount)
        commit("setAccountStrength", { account, strength: strength.value })
      // Else update it
      else
        commit("updateAccountStrength", {
          account,
          strength: strength.value,
          oldStrength
        })

      // Remove from outdated if need be
      if (
        account.lastPasswordUpdate <
        getDatePrevMonths(state.MAX_OUTDATED_MONTHS)
      )
        commit("removeFromOutdated", account)

      // Duplicated
      commit("removeFromDuplicated", account)
      const duplicatedWith = this.app.$accessor.vault.accounts.find(
        x =>
          x.isNative && x.id !== account.id && x.password === account.password
      )
      if (duplicatedWith) commit("setAsDuplicated", { account, duplicatedWith })

      // Recalculate the score
      dispatch("calculateScore")
    },

    removeAccount({ dispatch }, account: Account) {
      if (!account.isNative) return
      dispatch("removeFromAll", account)
      dispatch("calculateScore")
    },

    removeFromAll({ commit }, account: Account) {
      if (!account.isNative) return
      const strength = this.$getPasswordStrength(account.password as string)
      commit("removeFromStrength", { account, strength: strength.value })
      commit("removeFromDuplicated", account)
      commit("removeFromOutdated", account)
    },

    async removeFromAllWithId({ dispatch }, accountId) {
      const account = await dispatch("getCurrentAccount", accountId)
      if (!account) return
      dispatch("removeFromAll", account)
    },

    getCurrentAccount({ state }, accountId) {
      return [
        ...state.safe.accounts,
        ...state.okay.accounts,
        ...state.weak.accounts,
        ...state.compromised.accounts
      ].find(x => x.id === accountId)
    },

    buildResult(
      _store,
      {
        totalAccounts,
        duplicated,
        outdated,
        compromised,
        weak,
        okay,
        safe
      }: BuildAnalyzesOptions
    ): Omit<Analyze, "score"> {
      return {
        duplicated: {
          counter: duplicated.length,
          accounts: duplicated
        },
        outdated: {
          counter: outdated.length,
          accounts: outdated
        },
        compromised: {
          counter: compromised.length,
          accounts: compromised
        },
        weak: {
          counter: weak.length,
          accounts: weak
        },
        okay: {
          counter: okay.length,
          accounts: okay
        },
        safe: {
          counter: safe.length,
          accounts: safe
        },
        totalAccounts
      }
    }
  }
)
