import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AssetService } from './asset/asset.service'
import { CoingeckoService } from './asset/crypto_api/coingecko.service'
import { FiatService } from './conversion/fiat/fiat.service'

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
    const options: SwaggerCustomOptions = {
      customSiteTitle: 'Akasha',
    }
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
}
