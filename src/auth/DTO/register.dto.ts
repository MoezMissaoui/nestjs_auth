import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

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
    @Transform(({ value }) => value === 1 || value === 0)
    isActive?: boolean;
}