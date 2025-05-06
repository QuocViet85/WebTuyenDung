import { BadRequestException, HttpCode, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { USER } from './role/UserRole';
const bcrypt = require('bcryptjs')

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}

  getHashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.userModel.findOne({email: createUserDto.email});

    if (isExist) {
      throw new BadRequestException(`Email: ${createUserDto.email} đã tồn tại trên hệ thống. Vui lòng sử dụng Email khác`);
    }

    createUserDto.password = this.getHashPassword(createUserDto.password);
    let newUser = await this.userModel.create({
      ...createUserDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return newUser;
  }

  async register(registerUserDto: RegisterUserDto) {
    const isExist = await this.userModel.findOne({email: registerUserDto.email});

    if (isExist) {
      throw new BadRequestException(`Email: ${registerUserDto.email} đã tồn tại trên hệ thống. Vui lòng sử dụng Email khác`);
    }

    registerUserDto.password = this.getHashPassword(registerUserDto.password);
    
    let user = await this.userModel.create({
      ...registerUserDto,
      role: USER
    });
    return user;
  }

  findAll(currentPage: number, limit: number) {
    let offset = (currentPage - 1) * limit;
    limit = limit ? limit : 10;
    return this.userModel.find({}, {password: 0}).skip(offset).limit(limit);
  }

  findOne(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.userModel.findOne({ _id: id}, { password: 0 });
    }else {
      return 'Not Found user';
    }
  }

  findOneByUserName(username: string) {
    return this.userModel.findOne({
      email: username
    });
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    if (updateUserDto.password) {
      delete updateUserDto.password;
    }
    
    return await this.userModel.updateOne({_id: updateUserDto._id}, {
      ...updateUserDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await this.userModel.updateOne({ _id: id}, { deletedBy: {
        _id: user._id,
        email: user.email
      }});

      return this.userModel.softDelete({_id: id});
    }else {
      return 'Not Found User';
    }
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({_id}, {refreshToken})
  }
}
