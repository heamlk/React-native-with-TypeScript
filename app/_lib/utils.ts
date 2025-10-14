export function capitalize({ value }: { value: string }) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getRandomNumber({ min, max }: { min: number; max: number }) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function blank() {}
