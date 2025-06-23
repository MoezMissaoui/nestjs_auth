import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {

    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    
    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}