import { Optional } from "../@types/utils.ts";

import EncryptionHelper from "../helpers/encryption.helper.ts";
import { CollectionHelper } from "../helpers/collection.helper.ts";

import { NormalizedDoc } from "../utils/normalizeDocuments.ts";
import getDateBeforeSeconds from "../utils/getDateBeforeSeconds.ts";

import { Account, AccountSchema } from "../models/account.model.ts";

const AccountHelper = new CollectionHelper(Account);

type AccountType = NormalizedDoc<AccountSchema>;
type DuplicatedPasswords = {
  [plainPassword: string]: { passwordsId: string[] };
};

interface AnalyzeValue {
  counter: number;
  accounts: Omit<AccountType, "password">[];
}

type PasswordAnalyzesStrengths = "compromised" | "weak" | "okay" | "safe";
type AnalyzeKeys = PasswordAnalyzesStrengths | "outdated" | "duplicated";

type BuildAnalyzesOptions = { [key in keyof AnalyzesResult]: AccountType[] };

type AnalyzesResult = {
  [key in AnalyzeKeys]: AnalyzeValue;
};

const ENCRYPTED_PASSWORD_REG_EXP = /[\da-f]{32}\.[\da-f]/;

export default class AnalyzePasswordsService {
  public static async analyzeMine(userId: string): Promise<AnalyzesResult> {
    const accounts = await AccountHelper.findAllMine(userId);
    const analyzing: BuildAnalyzesOptions = {
      duplicated: [],
      outdated: [],
      compromised: [],
      weak: [],
      okay: [],
      safe: [],
    };

    const encryptedAccounts = accounts.filter((x) =>
      x.password.match(ENCRYPTED_PASSWORD_REG_EXP)
    );

    if (encryptedAccounts.length === 0) return this.buildResult(analyzing);

    const encryptionHelper = new EncryptionHelper();
    const decryptedAccounts = await Promise.all(
      encryptedAccounts.map((x) => {
        x.password = encryptionHelper.decrypt(x.password);
        return x;
      })
    );

    const duplications = this.setDuplicatedPasswords(accounts);
    analyzing.duplicated = decryptedAccounts.filter((x) =>
      this.checkIfDuplicated(duplications, x.password)
    );
    analyzing.outdated = decryptedAccounts.filter(
      this.checkIfOutdated.bind(this)
    );
    analyzing.compromised = decryptedAccounts.filter(
      this.checkIfCompromised.bind(this)
    );
    analyzing.weak = decryptedAccounts.filter(this.checkIfWeak.bind(this));
    analyzing.okay = decryptedAccounts.filter(this.checkIfOkay.bind(this));
    analyzing.safe = decryptedAccounts.filter(this.checkIfSafe.bind(this));
    return this.buildResult(analyzing);
  }

  private static oldestValidPasswordDateInSeconds = 60 * 60 * 24 * 30 * 3; // 3 months

  private static getOutdatedDate() {
    return getDateBeforeSeconds(this.oldestValidPasswordDateInSeconds);
  }

  private static checkIfOutdated(account: AccountType) {
    return Number(account.lastPasswordUpdate) <= Number(this.getOutdatedDate());
  }

  private static setDuplicatedPasswords(accounts: AccountType[]) {
    return accounts.reduce((prev, cur) => {
      const currentPasswordsIds = prev[cur.password]?.passwordsId;
      prev[cur.password] = {
        passwordsId: currentPasswordsIds
          ? [...currentPasswordsIds, cur.id.toString()]
          : [cur.id.toString()],
      };
      return prev;
    }, {} as DuplicatedPasswords);
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

  private static checkIfCompromised(account: AccountType) {
    return this.calculateScore(account.password).value === "compromised";
  }

  private static checkIfWeak(account: AccountType) {
    return this.calculateScore(account.password).value === "weak";
  }

  private static checkIfOkay(account: AccountType) {
    return this.calculateScore(account.password).value === "okay";
  }

  private static checkIfSafe(account: AccountType) {
    return this.calculateScore(account.password).value === "safe";
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
        accounts: duplicated.map(this.removePassword),
      },
      outdated: {
        counter: outdated.length || 0,
        accounts: outdated.map(this.removePassword),
      },
      compromised: {
        counter: compromised.length || 0,
        accounts: compromised.map(this.removePassword),
      },
      weak: {
        counter: weak.length || 0,
        accounts: weak.map(this.removePassword),
      },
      okay: {
        counter: okay.length || 0,
        accounts: okay.map(this.removePassword),
      },
      safe: {
        counter: safe.length || 0,
        accounts: safe.map(this.removePassword),
      },
    };
  }

  private static removePassword(
    account: AccountType
  ): Omit<AccountType, "password"> {
    const acc: Optional<AccountType, "password"> = { ...account };
    delete acc.password;
    return acc;
  }
}
