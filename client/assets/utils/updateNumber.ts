import sleep from "~/assets/utils/sleep"

export default function initUpdateNumber(number: number, speed = 20) {
  return {
    current: 0,
    update: async function updateNumber(custom?: number) {
      const num = custom ?? number
      if (num === this.current) return
      if (num > this.current) this.current++
      if (num < this.current) this.current--
      await sleep(speed)
      this.update(num)
    }
  }
}
