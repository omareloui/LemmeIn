import { assertEquals, assertMatch } from "../../deps.ts";
import EncryptionHelper from "../encryption.helper.ts";

const NAME_PREFIX = "helpers/encryption:";
const HEX_REGEX = /^[\da-fA-F]+$/;

const textToEncrypt = "testing the thing";

Deno.test({
  name: `${NAME_PREFIX} encrypt and decrypt a text`,
  fn() {
    const encryptionHelper = new EncryptionHelper();
    const encryption = encryptionHelper.encrypt(textToEncrypt);
    const plainText = encryptionHelper.decrypt(encryption);
    assertEquals(plainText, textToEncrypt);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should have iv and the encryption on received data from encryption`,
  fn() {
    const encryptionHelper = new EncryptionHelper();
    const encryptionData = encryptionHelper.encrypt(textToEncrypt);
    const [iv, encryption] = encryptionData.split(".");
    assertMatch(iv, HEX_REGEX);
    assertMatch(encryption, HEX_REGEX);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should have iv with 32 of length`,
  fn() {
    const encryptionHelper = new EncryptionHelper();
    const encryptionData = encryptionHelper.encrypt(textToEncrypt);
    const [iv, _encryption] = encryptionData.split(".");
    assertEquals(iv.length, 32);
  },
});
