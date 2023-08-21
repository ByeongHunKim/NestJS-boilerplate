import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { AppModule } from '@/src/app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('NestJS APIs')
    .setDescription('This is a sample NestJS Boilerplate REST API')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())

  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  await app.listen(8080)
}
bootstrap()
