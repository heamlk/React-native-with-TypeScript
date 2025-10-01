export const validateEmail = ({ email }: { email: string }) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function blank() {}
