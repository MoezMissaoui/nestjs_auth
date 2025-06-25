import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

    @ApiProperty({ example: 'Moez Missaoui' })
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'email@email.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongPassword123' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 1, description: '1 for active, 0 for inactive', required: false })
    @IsOptional()
    @Transform(({ value }) => value === 1 || value === 0)
    isActive?: boolean;
}