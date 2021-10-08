import {
  VirtualAccountSchema,
  VirtualNoteSchema,
  VirtualTagSchema,
  DecryptedAccountSchema,
} from "../models/index.ts";
import {
  TagService,
  AccountService,
  NoteService,
  AnalyzeAccountsService,
  AnalyzesResult,
} from "./index.ts";
import { EncryptionHelper } from "../helpers/index.ts";

interface Resources {
  tags: VirtualTagSchema[];
  accounts: VirtualAccountSchema[];
  analyzes: AnalyzesResult;
  notes: VirtualNoteSchema[];
}

export class ResourcesService {
  public static async getMine(userId: string): Promise<Resources> {
    const tags = await TagService.getAllMine(userId);
    const notes = await NoteService.getAllMine(userId);

    const accounts = await AccountService.getAllMine(userId);
    const encryptionHelper = new EncryptionHelper();

    const decryptedAccounts = await Promise.all(
      (accounts as DecryptedAccountSchema[]).map((x) => {
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
