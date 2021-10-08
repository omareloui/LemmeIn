import {
  DuplicatedPasswords,
  Analyze as AnalyzesResult,
  BuildAnalyzesOptions,
  Account,
} from "../@types/index.ts";
import { getDateBeforeSeconds } from "../utils/index.ts";
import { EncryptionHelper } from "../helpers/index.ts";
import { AccountService } from "./index.ts";

export class AnalyzeAccountsService {
  public static analyze(accounts: Account[]): AnalyzesResult {
    const analyzing: BuildAnalyzesOptions = {
      duplicated: [],
      outdated: [],
      compromised: [],
      weak: [],
      okay: [],
      safe: [],
    };

    const accountsToWorkOn = accounts.filter((x) => x.decryptedPassword);

    const duplications = this.setDuplicatedPasswords(accountsToWorkOn);

    analyzing.duplicated = accountsToWorkOn.filter((x) =>
      this.checkIfDuplicated(duplications, x.decryptedPassword!)
    );
    analyzing.outdated = accountsToWorkOn.filter(
      this.checkIfOutdated.bind(this)
    );
    analyzing.compromised = accountsToWorkOn.filter(
      this.checkIfCompromised.bind(this)
    );
    analyzing.weak = accountsToWorkOn.filter(this.checkIfWeak.bind(this));
    analyzing.okay = accountsToWorkOn.filter(this.checkIfOkay.bind(this));
    analyzing.safe = accountsToWorkOn.filter(this.checkIfSafe.bind(this));
    return this.buildResult(analyzing);
  }

  public static async analyzeMine(userId: string): Promise<AnalyzesResult> {
    const accounts = await AccountService.getAllMine(userId);
    const encryptionHelper = new EncryptionHelper();

    const decryptedAccounts = await Promise.all(
      (accounts as Account[]).map((x) => {
        if (x.encryptedPassword)
          x.decryptedPassword = encryptionHelper.decrypt(x.encryptedPassword);
        return x;
      })
    );
    return this.analyze(decryptedAccounts);
  }

  private static oldestValidPasswordDateInSeconds = 60 * 60 * 24 * 30 * 3; // 3 months

  private static getOutdatedDate() {
    return getDateBeforeSeconds(this.oldestValidPasswordDateInSeconds);
  }

  private static checkIfOutdated(account: Account) {
    return Number(account.lastPasswordUpdate) <= Number(this.getOutdatedDate());
  }

  private static setDuplicatedPasswords(accounts: Account[]) {
    const setDuplicatedPasswords = (
      prev: DuplicatedPasswords,
      cur: Account
    ) => {
      if (!cur.decryptedPassword) return prev;
      const currentPasswordsIds = prev[cur.decryptedPassword]?.passwordsId;
      prev[cur.decryptedPassword] = {
        passwordsId: currentPasswordsIds
          ? [...currentPasswordsIds, cur.id.toString()]
          : [cur.id.toString()],
      };
      return prev;
    };
    return accounts.reduce(setDuplicatedPasswords, {});
  }

  private static checkIfDuplicated(
    duplicatedPasswords: DuplicatedPasswords,
    password: string
  ) {
    return duplicatedPasswords[password].passwordsId.length > 1;
  }

  private static calculateScore(password: string) {
    let score = 0;
    const length = password.length;
    const suggestions: string[] = [];
    const DIVERSITIES = ["lowercase", "uppercase", "number", "symbol"] as const;
    const diversity = [] as typeof DIVERSITIES[number][];
    if (password.match(/(?=[a-z])/g)) diversity.push("lowercase");
    if (password.match(/(?=[A-Z])/g)) diversity.push("uppercase");
    if (password.match(/(?=\d)/g)) diversity.push("number");
    if (password.match(/(?=[!@#$%^&])/g)) diversity.push("symbol");

    // Calc score for length
    if (length >= 16) score += 6;
    else {
      if (length >= 10) score += 4;
      else if (length >= 8) score += 3;
      else if (length >= 6) score += 2;
      else if (length >= 4) score += 1;
      suggestions.push("Make it longer");
    }

    // Calc score if diversity
    DIVERSITIES.forEach((x) => {
      if (diversity.indexOf(x) > -1) score++;
      else suggestions.push(`Add ${x}`);
    });

    // Define max score
    const maxScore = 10;

    // Set percentage
    const percentage = Math.floor(((score || 1) / (maxScore || 1)) * 100);

    // Set the value
    let value: "safe" | "okay" | "weak" | "compromised";
    if (percentage > 80) value = "safe";
    else if (percentage > 70) value = "okay";
    else if (percentage > 50) value = "weak";
    else value = "compromised";

    return { score, maxScore, percentage, suggestions, value };
  }

  private static checkIfCompromised(account: Account) {
    return (
      this.calculateScore(account.decryptedPassword!).value === "compromised"
    );
  }

  private static checkIfWeak(account: Account) {
    return this.calculateScore(account.decryptedPassword!).value === "weak";
  }

  private static checkIfOkay(account: Account) {
    return this.calculateScore(account.decryptedPassword!).value === "okay";
  }

  private static checkIfSafe(account: Account) {
    return this.calculateScore(account.decryptedPassword!).value === "safe";
  }

  private static buildResult({
    duplicated,
    outdated,
    compromised,
    weak,
    okay,
    safe,
  }: BuildAnalyzesOptions): AnalyzesResult {
    return {
      duplicated: {
        counter: duplicated.length || 0,
        accounts: duplicated,
      },
      outdated: {
        counter: outdated.length || 0,
        accounts: outdated,
      },
      compromised: {
        counter: compromised.length || 0,
        accounts: compromised,
      },
      weak: {
        counter: weak.length || 0,
        accounts: weak,
      },
      okay: {
        counter: okay.length || 0,
        accounts: okay,
      },
      safe: {
        counter: safe.length || 0,
        accounts: safe,
      },
    };
  }
}
