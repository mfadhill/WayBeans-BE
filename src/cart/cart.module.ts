import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/lib/db/jwtsrategy';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, JwtModule, JwtStrategy, ConfigService],
})
export class CartModule { }
