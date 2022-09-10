import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AuthorizedWalletMiddleware } from './tenancy/tenancy.middleware'
import *  as cookieParser from 'cookie-parser'
import { AppService } from './app.service'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  swaggerSetup(app);
  let cookieSecret = app.get(AppService).cookieSecret;
  app.use(cookieParser(cookieSecret));
  app.use(AuthorizedWalletMiddleware)
  await app.listen(3000)
}

const swaggerSetup = (app: INestApplication) => {
   const config = new DocumentBuilder()
    .setTitle(`Akasha API DOC`)
    .setDescription(`The Crypto tracking and management API`)
    .setVersion(`1.0`)
    .build();
    const options: SwaggerCustomOptions = {
      customSiteTitle: `Akasha`,
    }
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`api`, app, document, options);
}

bootstrap()
