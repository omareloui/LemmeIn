import { pbkdf2 } from "pbkdf2"
import getHex from "~/assets/utils/convertUnit8ArrayToHex"

export default function createKey(password: string): Promise<string> {
  return new Promise((res, rej) => {
    const iterations = 5000
    const salt = ""
    const length = 32
    pbkdf2(password, salt, iterations, length, (err, key) => {
      if (err) rej(err.message)
      res(getHex(key))
    })
  })
}
