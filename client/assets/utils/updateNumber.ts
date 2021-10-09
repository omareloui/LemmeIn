import sleep from "~/assets/utils/sleep"

export default function initUpdateNumber(number: number, speed = 20) {
  return {
    current: 0,
    update: async function updateNumber() {
      if (number === 0) return
      if (number > 0) {
        if (this.current >= number) return
        this.current++
      } else if (number < 0) {
        if (this.current <= number) return
        this.current--
      }
      await sleep(speed)
      this.update()
    }
  }
}
