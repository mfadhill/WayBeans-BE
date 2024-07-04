import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/lib/db/authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorator/Role';
import { Role } from '@prisma/client';
// import { Cart } from 'src/cart/entities/cart.entity';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Roles(Role.Buyer)
  @Post(':CartId')
  @UseInterceptors(FileInterceptor('paymentProof'))
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Param('CartId') CartId: string,
    @Request() req,
    @UploadedFile() paymentProof

  ) {
    createTransactionDto.userId = req.user.id;
    return this.transactionService.create(CartId, createTransactionDto, paymentProof);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll()
  }

  @Roles(Role.Buyer)
  @Get('user')
  findAllByUserId(@Request() req) {
    return this.transactionService.findAllByBuyerId(req.user.id);
  }

  @Roles(Role.Seller)
  @Get('seller')
  findBySeller(@Request() req) {
    return this.transactionService.findAllBySellerId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Roles(Role.Seller)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
