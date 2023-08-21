# NestJS Boilerplate

## how to generate nestjs project
```bash
nest new nestjs-boilerplate
```

## how to set up infra
```bash
docker-compose -f infra/docker-compose.yml up -d
```

## how to set up database
```bash
npm run local:db:push
npm run local:db:generate-client
npm run local:db:seed
```

## how to start nestjs project
```bash
npm install
npm run start:dev
```

## how to create module, service, controller together in nestjs project
```bash
nest g resource auth --no-spec
```

## todo list

- [x] generate new nest project
- [x] clean tha project
- [x] infra set up (postgres DB)
- [x] swagger docs
- [x] add commands in package json about setting prisma
- [x] env setup ( config )
- [x] create auth module with basic controller and service
- [x] init prisma schema with module and service
- [x] work on auth service ( implement jwt, dto with validation pipe )
- [x] jwt strategy and guard and allow cookies
- [x] create users module with controller and service
- [x] wrap up and conclusions
