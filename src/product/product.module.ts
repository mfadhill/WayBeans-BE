import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudinaryService } from 'src/lib/config/claudinary.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, PassportModule,
    JwtModule.register({
      secret: "journey",
      signOptions: { expiresIn: '60m' },
    }),],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService],
})
export class ProductModule { }
