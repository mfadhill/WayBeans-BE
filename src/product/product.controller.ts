import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Request,
  UploadedFile,
  UnauthorizedException,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/lib/db/authGuard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorator/Role';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private jwtService: JwtService,
  ) { }

  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.Seller)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const decoded = this.jwtService.decode(token) as any;
    createProductDto.userId = decoded.id;

    console.log(createProductDto);
    return this.productService.create(createProductDto, files);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Roles(Role.Seller)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageProduct'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() imageProduct,
  ) {
    return this.productService.update(id, updateProductDto, imageProduct);
  }

  @Roles(Role.Seller)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
