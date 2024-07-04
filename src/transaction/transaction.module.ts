import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/lib/config/claudinary.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, CloudinaryService],
})
export class TransactionModule { }
