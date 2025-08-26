import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/user/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AUTH_SERVICE } from './auth.interfaces';
import { JwtConfigService } from './jwt/jwt.config';
import { HashingModule } from 'src/hashing/hash.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    HashingModule
  ],
  controllers: [AuthController],
  providers: [ 
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    JwtStrategy,
  ],
  exports: [AUTH_SERVICE, JwtModule],
})
export class AuthModule {}
