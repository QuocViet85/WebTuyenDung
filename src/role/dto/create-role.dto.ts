import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
import { Permission } from "src/permission/schema/permission.schema";

export class CreateRoleDto {
    @IsNotEmpty({message: 'name không được để trống'})
    name: string;
    
    @IsNotEmpty({message: 'description không được để trống'})
    description: string;

    @IsNotEmpty({message: 'isActive không được để trống'})
    @IsBoolean({message: 'Active có giá trị là Boolean'})
    isActive: boolean;

    @IsNotEmpty({message: 'permissions không được để trống'})
    @IsMongoId({each: true, message: 'Mỗi permission phải là object id'})
    @IsArray({message: 'permission phải là mảng'})
    permissions: mongoose.Schema.Types.ObjectId[];
}
