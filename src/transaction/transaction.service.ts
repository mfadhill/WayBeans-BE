import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';
import { CloudinaryService } from 'src/lib/config/claudinary.service';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) { }

  async create(cartId: string,
    createTransactionDto: CreateTransactionDto,
    file: Express.Multer.File,
  ) {
    try {
      const fileUpload = async () => {
        try {
          const result = await this.cloudinary.uploadImage(file);

          return createTransactionDto.paymentProof = result.secure_url
        } catch (error) {
          console.log(error);
        }
      };

      await Promise.all([fileUpload()]);
      createTransactionDto.status = Status.wait;

      const findCart = await this.prisma.cart.findFirst({
        where: { id: cartId },
        include: {
          product: true,
        },
      });

      if (!findCart.product || findCart.product.stock <= 0) {
        throw new HttpException('stock not available', HttpStatus.CONFLICT);
      }


      if (findCart.product.stock - findCart.total <= 0) {
        throw new HttpException('stock not available', HttpStatus.CONFLICT);
      }
      const transaction = await this.prisma.transaction.create({
        data: {
          ...createTransactionDto,
          total: findCart.total,
          totalPrice: findCart.totalPrice,
          productTransactions: {
            create: {
              productId: findCart.product.id,
            },
          },
        },
        include: {
          productTransactions: true,
        },
      });
      await this.prisma.product.update({
        where: { id: findCart.product.id },
        data: { stock: findCart.product.stock - transaction.total },
      });

      await this.prisma.cart.delete({ where: { id: findCart.id } });

      return transaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findAllByBuyerId(userId: string) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: { userId },
        include: {
          productTransactions: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" }
      });
      return transactions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findAll() {
    try {
      const transactions = await this.prisma.transaction.findMany({
        include: {
          productTransactions: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" }

      });
      return transactions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findAllBySellerId(sellerId: string) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          productTransactions: {
            AND: {
              product: {
                userId: sellerId,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          productTransactions: {
            include: {
              product: true,
            },
          },
        },
      });
      return transactions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(transactionId: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          productTransactions: {
            include: {
              product: true,
            },
          },
        },
      });
      return transaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async update(
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const findProduct = await this.prisma.transaction.findFirst({
      where: { id: transactionId },
      include: {
        productTransactions: {
          include: {
            product: true,
          },
        },
      },
    });
    if (updateTransactionDto.status === 'reject') {
      await this.prisma.product.update({
        where: { id: findProduct.productTransactions.productId },
        data: {
          stock:
            findProduct.productTransactions.product.stock + findProduct.total,
        },
      });
    }
    try {
      const transaction = await this.prisma.transaction.update({
        where: { id: transactionId },
        data: updateTransactionDto,
      });
      return transaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(transactionId: string) {
    try {
      await this.prisma.transaction.delete({
        where: { id: transactionId },
      });
      return { message: 'Transaction removed successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
