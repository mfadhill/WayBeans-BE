import { Status } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
    userId: string;
    @IsNotEmpty()
    name: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    possCode: string;
    @IsNotEmpty()
    address: string;
    totalOrder: number;
    status: Status;
    paymentProof: string
}
