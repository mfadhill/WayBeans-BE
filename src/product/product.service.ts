import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/lib/config/claudinary.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) { }
  async create(createProductDto: CreateProductDto, files: Array<Express.Multer.File>) {
    const user = await this.prisma.user.findFirst({
      where: { id: createProductDto.userId },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    createProductDto.userId = user.id;

    const uploadImage = async () => {
      try {
        const result = await this.cloudinary.uploadImage(files[0]);
        createProductDto.imageProduct = result.secure_url;
        return createProductDto.imageProduct;
      } catch (error) {
        console.log(error);
      }
    };

    await Promise.all([uploadImage()]);

    const createProduct = await this.prisma.product.create({
      data: {
        ...createProductDto,
        price: Number(createProductDto.price),
        stock: Number(createProductDto.stock),
      },
    });

    return createProduct;
  }

  async findAll() {
    try {
      const product = await this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return product;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: string): Promise<Product> {
    return await this.prisma.product.findFirst({ where: { id: id } });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File,
  ) {
    try {
      const findProduct = await this.prisma.product.findFirst({
        where: { id },
      });
      const stock = parseInt(updateProductDto.stock);

      const price = parseInt(updateProductDto.price);
      if (!file) {
        return await this.prisma.product.update({
          where: { id },
          data: { ...updateProductDto, stock, price },
        });
      }
      const deleteOldImage = async () => {
        try {
          return await this.cloudinary.deleteFile(findProduct.imageProduct);
        } catch (error) {
          console.log(error);
        }
      };
      const fileUpload = async () => {
        try {
          const result = await this.cloudinary.uploadImage(file);
          return (updateProductDto.imageProduct = result.secure_url);
        } catch (error) {
          console.log(error);
        }
      };

      await Promise.all([deleteOldImage(), fileUpload()]);

      return await this.prisma.product.update({
        where: { id: findProduct.id },
        data: { ...updateProductDto, stock, price },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }
  async remove(id: string) {
    try {
      const findProduct = await this.prisma.product.findFirst({
        where: { id },
      });
      const deleteOldImage = async () => {
        try {
          return await this.cloudinary.deleteFile(findProduct.imageProduct);
        } catch (error) {
          console.log(error);
        }
      };

      return await this.prisma.product.delete({
        where: { id: findProduct.id },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }
}


