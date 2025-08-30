import { Type } from "class-transformer";
import { isEmail, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import { CopyOptions } from "fs";
import mongoose from "mongoose";

class Company {
    _id: mongoose.Schema.Types.ObjectId;

    name: string;
}

//Admin tạo người dùng
export class CreateUserDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsEmail({}, {message: 'Email không đúng định dạng'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    @IsNotEmpty({message: 'Age không được để trống'})
    age: number;

    @IsNotEmpty({message: 'Gender không được để trống'})
    gender: string;
    
    @IsNotEmpty({message: 'Address không được để trống'})
    address: string;

    @IsNotEmpty({message: 'Role không được để trống'})
    role: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}

//Người dùng đăng kí
export class RegisterUserDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsEmail({}, {message: 'Email không đúng định dạng'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    @IsNotEmpty({message: 'Age không được để trống'})
    age: number;

    @IsNotEmpty({message: 'Gender không được để trống'})
    gender: string;
    
    @IsNotEmpty({message: 'Address không được để trống'})
    address: string;
}
