import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  async create(createCartDto: CreateCartDto) {
    try {

      const findProduct = await this.prisma.product.findFirst({
        where: { id: createCartDto.productId },
      });

      if (!findProduct)
        throw new HttpException('product not found', HttpStatus.CONFLICT);

      const findCart = await this.prisma.cart.findMany({
        where: { userId: createCartDto.userId, productId: findProduct.id }
      })

      if (findCart.length > 0) throw new HttpException('your alredy add to cart', HttpStatus.CONFLICT)

      const createCart = await this.prisma.cart.create({
        data: {
          productId: findProduct.id,
          userId: createCartDto.userId,
        },
      });

      return createCart;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async findByUserId(userId: string) {
    try {
      const carts = await this.prisma.cart.findMany({
        where: { userId },
        include: {
          product: true,
        },
      });
      return carts;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { id },
        include: {
          product: true,
        },
      });
      if (!cart) {
        throw new HttpException(
          `Cart with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return cart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    try {
      const findCart = await this.prisma.cart.findFirst({
        where: { id },
        include: {
          product: true,
        },
      });

      if (!findCart.product || findCart.product.stock <= 0) {
        throw new HttpException('stock not available', HttpStatus.CONFLICT);
      }

      if (findCart.product.stock - parseInt(updateCartDto.totalOrder) < 0) {
        throw new HttpException('stock not available', HttpStatus.CONFLICT);
      }

      const totalOrder = parseInt(updateCartDto.totalOrder)
      const totalPrice = totalOrder * findCart.product.price
      return await this.prisma.cart.update({
        where: { id: id },
        data: {
          total: totalOrder,
          totalPrice: totalPrice,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.cart.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }
}
