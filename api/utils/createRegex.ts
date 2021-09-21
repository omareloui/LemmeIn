interface RegexOptions {
  i?: boolean;
  g?: boolean;
  exactText?: boolean;
}

export default function createRegex(
  text: string,
  { i = false, g = false, exactText = false }: RegexOptions = {}
): RegExp {
  let regexOptions = "";
  if (i) regexOptions += "i";
  if (g) regexOptions += "g";
  const normalizedText = text.replace(/([/\\^$+*.|\-()<>[\]])/g, "\\$1");
  const regexText = exactText ? `^${normalizedText}$` : normalizedText;
  return new RegExp(regexText, regexOptions);
}
