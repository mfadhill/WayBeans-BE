import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/lib/config/claudinary.module';
import { JwtAuthGuard } from 'src/lib/db/authGuard';
import { CloudinaryService } from 'src/lib/config/claudinary.service';
import { JwtStrategy } from 'src/lib/db/jwtsrategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'coffe',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    CloudinaryService,
    JwtStrategy
  ],
})
export class AuthModule { }
