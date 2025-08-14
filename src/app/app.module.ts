import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from 'src/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [appConfig] }),
    MongooseModule.forRoot(appConfig().db.mongodb.compassUrl),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
