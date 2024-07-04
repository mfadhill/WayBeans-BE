import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string;
    @IsString()
    stock: string
    @IsString()
    price: string
    @IsNotEmpty()
    description: string
    imageProduct: string
    userId: string
}
