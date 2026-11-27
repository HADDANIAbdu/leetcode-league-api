import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDTO {
    @IsEmail()  email: string;
    @IsString() @MinLength(2) @MaxLength(30) username: string;
    @IsOptional() @IsString() leetcodeUsername?: string;
    @IsString() @MinLength(8) @MaxLength(40) password: string;
}

export class LoginDTO {
    @IsEmail() email: string;
    @IsString() password: string;
}

export class refreshDTO {
    @IsString() refreshToken: string;
}