export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  return /^(0|\+84)(\d{9})$/.test(phone)
}

export const isValidAddress = (address: string): boolean => {
  return address.trim().length >= 10
}
