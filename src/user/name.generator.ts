import _ from 'lodash'
import { Injectable } from '@nestjs/common'

const NAME_PREFIX = 'user'
const NAME_LEN = 12
const NAME_NUMBER_LEN = NAME_LEN - NAME_PREFIX.length

@Injectable()
export class NameGenerator {
  generateRandomName(): string {
    const randomNumber = _.random(
      10 ** NAME_NUMBER_LEN,
      10 ** (NAME_NUMBER_LEN + 1),
    )
    return `${NAME_PREFIX}${randomNumber}`
  }
}
