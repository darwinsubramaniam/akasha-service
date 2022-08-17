import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  swaggerSetup(app);
  await app.listen(3000)
}
bootstrap()

const swaggerSetup = (app: INestApplication) => {
   const config = new DocumentBuilder()
    .setTitle('Akasha API DOC')
    .setDescription('The Crypto tracking and management API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
