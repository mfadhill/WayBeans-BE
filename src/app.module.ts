import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CloudinaryModule } from './lib/config/claudinary.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryService } from './lib/config/claudinary.service';
import { TransactionModule } from './transaction/transaction.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule, ProductModule, CloudinaryModule, PrismaModule, TransactionModule, CartModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }
