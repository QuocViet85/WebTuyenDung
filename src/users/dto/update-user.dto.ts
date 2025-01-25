import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) //kế thừa class nhưng bỏ đi thuộc tính chỉ định
{
    _id: string;
}
