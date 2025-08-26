import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from './../config/app.config';
import { MongooseConfigService } from './mongoose.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [appConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
