import { compareHash, genSalt, hash } from "../deps.ts";

class HashHelper {
  public static async hash(str: string): Promise<string> {
    const salt = await genSalt(14);
    return await hash(str, salt);
  }

  public static async compare(plain: string, hash: string): Promise<boolean> {
    return await compareHash(plain, hash);
  }
}

export default HashHelper;
