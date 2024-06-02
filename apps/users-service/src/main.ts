import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.enableCors({
        origin: configService.get('client.url'),
        credentials: true,
    });

    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            host: configService.get('microservices.users.host'),
            port: configService.get('microservices.users.port'),
        },
    });
    app.use(cookieParser());

    await app.startAllMicroservices();
    await app.listen(configService.get('port'));
}
bootstrap();
