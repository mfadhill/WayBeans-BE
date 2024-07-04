import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/lib/db/authGuard';
import { RolesGuard } from 'src/lib/db/roleGuard';
import { Roles } from 'src/auth/decorator/Role';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Roles(Role.Buyer)
  @Post(':ProductId')
  create(@Body() createCartDto: CreateCartDto, @Request() req, @Param('ProductId') ProductId: string) {
    createCartDto.userId = req.user.id
    createCartDto.productId = ProductId
    return this.cartService.create(createCartDto);
  }

  @Roles(Role.Buyer)
  @Get()
  findAll(
    @Request() req
  ) {
    return this.cartService.findByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Roles(Role.Buyer)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
