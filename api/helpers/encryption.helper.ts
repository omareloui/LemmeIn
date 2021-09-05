import { Aes256Cfb8 } from "../deps.ts";
import config from "../config/config.ts";
import randomTextGenerator from "../utils/randomTextGenerator.ts";
import convertToHex from "../utils/convertUnit8ArrayToHex.ts";
import convertToUnit8Array from "../utils/convertHexToUnit8Array.ts";

const { passwordEncryptionSecret } = config;

export default class EncryptionHandler {
  algorithm: typeof Aes256Cfb8;
  te: TextEncoder;
  td: TextDecoder;

  constructor() {
    this.algorithm = Aes256Cfb8;
    this.te = new TextEncoder();
    this.td = new TextDecoder();
  }

  encrypt(password: string): { encryption: string; iv: string } {
    if (!passwordEncryptionSecret) throw new Error("No secret provided");
    const secret = this.te.encode(passwordEncryptionSecret);
    const iv = this.te.encode(randomTextGenerator());
    const encodedPassword = this.te.encode(password);

    const cypher = new this.algorithm(secret, iv);
    cypher.encrypt(encodedPassword);

    return {
      encryption: convertToHex(encodedPassword),
      iv: convertToHex(iv),
    };
  }

  decrypt(passwordEncryptionHex: string, ivHex: string): string {
    const envSecret = Deno.env.get("PASSWORD_ENCRYPTION_SECRET");
    if (!envSecret) throw new Error("No secret provided");
    const secret = this.te.encode(envSecret);
    const iv = convertToUnit8Array(ivHex);
    const passwordUnit8Array = convertToUnit8Array(passwordEncryptionHex);

    const cypher = new this.algorithm(secret, iv);
    cypher.decrypt(passwordUnit8Array);
    const password = this.td.decode(passwordUnit8Array);
    return password;
  }
}
