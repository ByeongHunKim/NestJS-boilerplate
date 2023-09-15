import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common'

@Injectable()
export class CustomLogger extends ConsoleLogger {
  getTimestamp(): string {
    return new Date().toISOString()
  }

  protected colorize(message: string, logLevel: LogLevel): string {
    if (logLevel !== 'error') {
      return super.colorize(message, logLevel)
    }
    const lines = message.split('\n')
    lines[0] = super.colorize(lines[0], logLevel)
    return lines.join('\n')
  }
}
