import { env } from 'node:process'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { AppModule } from '@/src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { AppExceptionFilter } from '@/src/app.exception.filter'
import { CustomLogger } from '@/src/logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  app.useLogger(app.get(CustomLogger))

  if (env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NestJS APIs')
      .setDescription('This is a sample NestJS Boilerplate REST API')
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
  }

  app.use(cookieParser())

  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })

  app.useGlobalFilters(new AppExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  await app.listen(8080)
}
bootstrap()
