import {
  Account,
  Tag,
  Note,
  // Analyze
} from "./index.ts";

export interface Resources {
  accounts: Account[];
  tags: Tag[];
  notes: Note[];
  // analyzes: Analyze;
}
