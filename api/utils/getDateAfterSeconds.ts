export default function getDateAfterSeconds(seconds: number) {
  const date = new Date();
  return new Date(date.setSeconds(date.getSeconds() + seconds));
}
