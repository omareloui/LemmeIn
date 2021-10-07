import { Account } from "../../models/account.model.ts";

import { ServiceTester } from "./service.test.helper.ts";

import AnalyzeAccountsService from "../analyze-accounts.service.ts";
import AccountService from "../account.service.ts";

// Make sure the accounts model is empty
await Account.drop();

const serviceTester = new ServiceTester(
  "analyze-accounts",
  AnalyzeAccountsService
);

const userId = serviceTester.userId;
await Promise.all(
  [
    { app: "compromised app", password: "comp" },
    { app: "weak app", password: "weak?right, it should" },
    { app: "safe app", password: "thatMustBeSoStrongAndSafe!2ForSure" },
    { app: "weak duplicated app", password: "that will be duplicated" },
    { app: "weak duplicated app", password: "that will be duplicated" },
  ].map((options) => AccountService.createMine(options, userId))
);

serviceTester.test(
  "should analyze and have all the correct analyzing data",
  async () => {
    const analyzeResult = await AnalyzeAccountsService.analyzeMine(userId);
    serviceTester.shouldEquals(analyzeResult.safe.counter, 1);
    serviceTester.shouldEquals(analyzeResult.okay.counter, 0);
    serviceTester.shouldEquals(analyzeResult.weak.counter, 3);
    serviceTester.shouldEquals(analyzeResult.compromised.counter, 1);
    serviceTester.shouldEquals(analyzeResult.duplicated.counter, 2);
    serviceTester.shouldEquals(analyzeResult.outdated.counter, 0);
  }
);
