import { mutationTree, actionTree } from "typed-vuex"
import {
  // Analyze, AnalyzeKeys,
  Account
  // PasswordStrengthValues
} from "~/@types"
// import getDatePrevMonths from "~/assets/utils/getDatePrevMonths"

type AccountsType = Account[]

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
  //   setData(state, data: Analyze) {
  //     // eslint-disable-next-line @typescript-eslint/no-extra-semi
  //     ;(Object.keys(data) as AnalyzeKeys[]).forEach(key => {
  //       state[key] = data[key]
  //     })
  //   },

  clearData(state) {
    state.duplicated = { counter: 0, accounts: [] as AccountsType }
    state.outdated = { counter: 0, accounts: [] as AccountsType }
    state.safe = { counter: 0, accounts: [] as AccountsType }
    state.okay = { counter: 0, accounts: [] as AccountsType }
    state.weak = { counter: 0, accounts: [] as AccountsType }
    state.compromised = { counter: 0, accounts: [] as AccountsType }
  }

  //   setAccountStrength(
  //     state,
  //     {
  //       account,
  //       strength
  //     }: { account: Account; strength: PasswordStrengthValues }
  //   ) {
  //     if (!account.decryptedPassword || account.password) return
  //     const wantedStateStrength = state[strength]
  //     wantedStateStrength.accounts.push(account)
  //     wantedStateStrength.counter++
  //     state.totalAccounts++
  //   },

  //   updateAccountStrength(
  //     state,
  //     {
  //       account,
  //       oldStrength,
  //       strength
  //     }: {
  //       account: Account
  //       oldStrength: PasswordStrengthValues
  //       strength: PasswordStrengthValues
  //     }
  //   ) {
  //     if (
  //       !account.decryptedPassword ||
  //       account.password ||
  //       oldStrength === strength
  //     )
  //       return
  //     // Remove from the old strength
  //     state[oldStrength].accounts = state[oldStrength].accounts.filter(
  //       x => x.id !== account.id
  //     )
  //     state[oldStrength].counter--
  //     // Add to the new strength
  //     state[strength].accounts.push(account)
  //     state[strength].counter++
  //   },

  //   setAsOutdated(state, account: Account) {
  //     const { outdated } = state
  //     outdated.accounts.push(account)
  //     outdated.counter++
  //   },

  //   setAsDuplicated(
  //     state,
  //     { account, duplicatedWith }: { account: Account; duplicatedWith: Account }
  //   ) {
  //     const { duplicated } = state
  //     const alreadyExistingDuplication = duplicated.accounts.find(
  //       x => x.id === duplicatedWith.id
  //     )
  //     if (!alreadyExistingDuplication) {
  //       duplicated.accounts.push(duplicatedWith)
  //       duplicated.counter++
  //     }
  //     duplicated.accounts.push(account)
  //     duplicated.counter++
  //   },

  //   setScore(state, score: number) {
  //     if (score >= 0 && score <= 100) state.score = score
  //   },

  //   removeFromStrength(
  //     state,
  //     {
  //       account,
  //       strength
  //     }: { account: Account; strength: PasswordStrengthValues }
  //   ) {
  //     // Remove from its strength
  //     const wantedState = state[strength]
  //     const accountIndexToRemove = wantedState.accounts.findIndex(
  //       x => x.id === account.id
  //     )
  //     if (accountIndexToRemove > -1) {
  //       wantedState.accounts.splice(accountIndexToRemove, 1)
  //       wantedState.counter--
  //     }

  //     // Remove from total counter
  //     state.totalAccounts--
  //   },

  //   removeFromOutdated(state, account: Account) {
  //     const accountIndexToRemove = state.outdated.accounts.findIndex(
  //       x => x.id === account.id
  //     )
  //     if (accountIndexToRemove > -1) {
  //       state.outdated.accounts.splice(accountIndexToRemove, 1)
  //       state.outdated.counter--
  //     }
  //   },

  //   removeFromDuplicated(state, account: Account) {
  //     const accountToRemove = state.duplicated.accounts.find(
  //       x => x.id === account.id
  //     )
  //     if (accountToRemove) {
  //       const allSamePasswordAccounts = state.duplicated.accounts.filter(
  //         x => x.decryptedPassword === accountToRemove.decryptedPassword
  //       )

  //       // Remove the only provided account if it's duplicated with more than one account
  //       if (allSamePasswordAccounts.length > 2) {
  //         state.duplicated.accounts = state.duplicated.accounts.filter(
  //           x => x.id !== account.id
  //         )
  //         state.duplicated.counter--
  //       }

  //       // Remove both if they're only the duplicated
  //       if (allSamePasswordAccounts.length === 2) {
  //         state.duplicated.accounts = state.duplicated.accounts.filter(
  //           x => x.decryptedPassword !== accountToRemove.decryptedPassword
  //         )
  //         state.duplicated.counter -= 2
  //       }
  //     }
  //   }
})

export const actions = actionTree(
  { state, mutations },
  {
    //     async init({ commit }) {
    //       const { data } = await this.$axios.get("/analyze")
    //       const analyzeResult = data as Analyze
    //       commit("setData", analyzeResult)
    //     },
    //     recalculateScore({ state, commit }) {
    //       const { safe, okay, weak, compromised, outdated, duplicated } = state
    //       let totalScore = 0
    //       const safeLength = safe.accounts.length
    //       const okayLength = okay.accounts.length
    //       const weakLength = weak.accounts.length
    //       const compromisedLength = compromised.accounts.length
    //       const nonOAuthAccountsTotal =
    //         safeLength + okayLength + weakLength + compromisedLength
    //       // Each account could be only one of these
    //       totalScore += safeLength
    //       totalScore += okayLength * 0.75
    //       totalScore += weakLength * 0.5
    //       totalScore += compromisedLength * 0
    //       // But there are sub categories the account could have it with any other
    //       // strength value
    //       totalScore -= outdated.accounts.length * 0.5
    //       totalScore -= duplicated.accounts.length * 0.5
    //       commit("setScore", Math.floor((totalScore / nonOAuthAccountsTotal) * 100))
    //     },
    //     addAccount({ state, commit, dispatch }, account: Account) {
    //       if (!account.decryptedPassword) return
    //       // Set its strength
    //       const strength = this.$getPasswordStrength(account.decryptedPassword)
    //       commit("setAccountStrength", { account, strength: strength.value })
    //       // Set if it's outdated
    //       const maxOldDate = getDatePrevMonths(state.MAX_OUTDATED_MONTHS)
    //       if (account.lastPasswordUpdate < maxOldDate)
    //         commit("setAsOutdated", account)
    //       // Set if duplicated
    //       const duplicatedWith = this.app.$accessor.vault.accounts.find(
    //         x =>
    //           x.id !== account.id &&
    //           x.decryptedPassword === account.decryptedPassword
    //       )
    //       if (duplicatedWith) commit("setAsDuplicated", { account, duplicatedWith })
    //       // Recalculate the score
    //       dispatch("recalculateScore")
    //     },
    //     editAccount({ state, commit, dispatch }, account: Account) {
    //       if (!account.decryptedPassword) {
    //         dispatch("removeFromAllWithId", account.id)
    //         return
    //       }
    //       const findAccount = (x: AccountsType[number]) => x.id === account.id
    //       // Get the account and its old strength
    //       let oldStrength = "safe" as PasswordStrengthValues
    //       let oldAccount = state.safe.accounts.find(findAccount)
    //       if (!oldAccount) {
    //         oldAccount = state.okay.accounts.find(findAccount)
    //         oldStrength = "okay"
    //       }
    //       if (!oldAccount) {
    //         oldAccount = state.weak.accounts.find(findAccount)
    //         oldStrength = "weak"
    //       }
    //       if (!oldAccount) {
    //         oldAccount = state.compromised.accounts.find(findAccount)
    //         oldStrength = "compromised"
    //       }
    //       // Return if the password's the same
    //       if (oldAccount?.decryptedPassword === account.decryptedPassword) return
    //       // Update its strength
    //       const strength = this.$getPasswordStrength(account.decryptedPassword)
    //       // If there wasn't an old account (meaning it changed from oAuth to native)
    //       //  then add it as a new one
    //       if (!oldAccount)
    //         commit("setAccountStrength", { account, strength: strength.value })
    //       // Else update it
    //       else
    //         commit("updateAccountStrength", {
    //           account,
    //           strength: strength.value,
    //           oldStrength
    //         })
    //       // Remove from outdated
    //       commit("removeFromOutdated", account)
    //       // Duplicated
    //       commit("removeFromDuplicated", account)
    //       const duplicatedWith = this.app.$accessor.vault.accounts.find(
    //         x =>
    //           x.id !== account.id &&
    //           x.decryptedPassword === account.decryptedPassword
    //       )
    //       if (duplicatedWith) commit("setAsDuplicated", { account, duplicatedWith })
    //       // Recalculate the score
    //       dispatch("recalculateScore")
    //     },
    //     removeAccount({ dispatch }, account: Account) {
    //       if (!account.decryptedPassword) return
    //       dispatch("removeFromAll", account)
    //       dispatch("recalculateScore")
    //     },
    //     removeFromAll({ commit }, account: Account) {
    //       if (!account.decryptedPassword) return
    //       const strength = this.$getPasswordStrength(account.decryptedPassword)
    //       commit("removeFromStrength", { account, strength: strength.value })
    //       commit("removeFromDuplicated", account)
    //       commit("removeFromOutdated", account)
    //     },
    //     async removeFromAllWithId({ dispatch }, accountId) {
    //       const account = await dispatch("getCurrentAccount", accountId)
    //       dispatch("removeFromAll", account)
    //     },
    //     getCurrentAccount({ state }, accountId) {
    //       return [
    //         ...state.safe.accounts,
    //         ...state.okay.accounts,
    //         ...state.weak.accounts,
    //         ...state.compromised.accounts
    //       ].find(x => x.id === accountId)
    //     }
  }
)
