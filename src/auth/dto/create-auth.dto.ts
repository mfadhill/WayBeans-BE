import { Role } from "@prisma/client";
import { IsEmail, IsNotEmpty, Min } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    fullname: string;
    @IsEmail()
    email: string;
    password: string;
    role: Role;
    photoProfile?: string

}