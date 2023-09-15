export interface MapOption {
  excludes?: string | string[]
}

export class CommonMapper {
  protected mapSourceToTarget<S = object, T = object>(
    source: S,
    target: T,
    option?: MapOption,
  ): T {
    let checker
    if (option?.excludes instanceof Array) {
      checker = option?.excludes?.includes.bind(this)
    } else if (typeof option?.excludes === 'string') {
      checker = (key) => option?.excludes === key
    } else {
      checker = () => false
    }
    Object.getOwnPropertyNames(target).forEach((key) => {
      if (checker(key)) {
        return
      }
      target[key] = source[key]
    })
    return target
  }
}
