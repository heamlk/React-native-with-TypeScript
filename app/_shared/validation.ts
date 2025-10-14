export const validateEmail = ({ email }: { email: string }) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validateAge = ({ value }: { value: string }) => {
  const numberPattern = /^\d+(\.\d+)?$/

  if (!numberPattern.test(value)) {
    return 21
  }

  let num = parseFloat(value)

  if (num < 21) num = 21
  if (num > 100) num = 100

  return num
}

export default function blank() {}
