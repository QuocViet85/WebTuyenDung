import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) //kế thừa class nhưng bỏ đi thuộc tính chỉ định
{
    @IsEmpty({message: '_id không được để trống'})
    _id: string;
}
