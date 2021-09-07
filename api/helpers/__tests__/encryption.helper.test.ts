import { Test } from "../test.helper.ts";
import { assertEquals, assertMatch } from "../../deps.ts";
import EncryptionHelper from "../encryption.helper.ts";

const testHelper = new Test("helpers/encryption:");
const HEX_REGEX = /^[\da-fA-F]+$/;

const textToEncrypt = "testing the thing";

testHelper.test("encrypt and decrypt a text", () => {
  const encryptionHelper = new EncryptionHelper();
  const encryption = encryptionHelper.encrypt(textToEncrypt);
  const plainText = encryptionHelper.decrypt(encryption);
  assertEquals(plainText, textToEncrypt);
});

testHelper.test(
  "should have iv and the encryption on received data from encryption",
  () => {
    const encryptionHelper = new EncryptionHelper();
    const encryptionData = encryptionHelper.encrypt(textToEncrypt);
    const [iv, encryption] = encryptionData.split(".");
    assertMatch(iv, HEX_REGEX);
    assertMatch(encryption, HEX_REGEX);
  }
);

testHelper.test("should have iv with 32 of length", () => {
  const encryptionHelper = new EncryptionHelper();
  const encryptionData = encryptionHelper.encrypt(textToEncrypt);
  const [iv, _encryption] = encryptionData.split(".");
  assertEquals(iv.length, 32);
});
