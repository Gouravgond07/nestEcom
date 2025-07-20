import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class CreteUserDto {
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;
}