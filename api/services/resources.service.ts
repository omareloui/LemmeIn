import { Account, Resources } from "../@types/index.ts";

import {
  TagService,
  AccountService,
  NoteService,
  AnalyzeAccountsService,
} from "./index.ts";
import { EncryptionHelper } from "../helpers/index.ts";

export class ResourcesService {
  public static async getMine(userId: string): Promise<Resources> {
    const tags = await TagService.getAllMine(userId);
    const notes = await NoteService.getAllMine(userId);

    const accounts = await AccountService.getAllMine(userId);
    const encryptionHelper = new EncryptionHelper();

    const decryptedAccounts = await Promise.all(
      (accounts as Account[]).map((x) => {
        if (x.encryptedPassword)
          x.decryptedPassword = encryptionHelper.decrypt(x.encryptedPassword);
        return x;
      })
    );

    const analyzes = await AnalyzeAccountsService.analyze(decryptedAccounts);

    return {
      tags,
      accounts,
      analyzes,
      notes,
    };
  }
}
