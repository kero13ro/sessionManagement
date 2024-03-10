export const rangeMapping = (num: number | undefined) => {
  if (!num) return ''
  switch (num) {
    case 1:
      return 'Morning'
    case 2:
    default:
      return 'Afternoon'
  }
}

export const siteMapping = (num: number | undefined) => {
  if (!num) return ''
  switch (num) {
    case 1:
      return 'A'
    case 2:
    default:
      return 'B'
  }
}
