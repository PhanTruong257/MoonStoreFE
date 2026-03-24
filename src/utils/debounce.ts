export const debounce = <T extends (...args: never[]) => void>(
  callback: T,
  wait = 300,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | undefined

  return (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => callback(...args), wait)
  }
}
