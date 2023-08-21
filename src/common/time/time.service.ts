import { Injectable } from '@nestjs/common'
import moment, { Moment } from 'moment'

@Injectable()
export class TimeService {
  now(): Moment {
    return moment()
  }
}
