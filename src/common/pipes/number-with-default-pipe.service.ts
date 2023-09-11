import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class NumberWithDefaultPipe implements PipeTransform<string, number> {
  constructor(private readonly defaultValue: number) {}

  transform(value: string): number {
    if (!value) {
      return this.defaultValue
    }
    const val = Number(value)
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed. "${val}" is not an integer.`,
      )
    }
    return val
  }
}
