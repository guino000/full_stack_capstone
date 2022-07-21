import {isEqual} from 'lodash'

export function uniqForObject<T>(array: T[]): T[] {
  const result: T[] = []
  for (const item of array) {
    const found = result.some(value => isEqual(value, item))
    if (!found) {
      result.push(item)
    }
  }
  return result
}
