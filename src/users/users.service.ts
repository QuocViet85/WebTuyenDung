import { HttpCode, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { Http2ServerResponse } from 'http2';
const bcrypt = require('bcryptjs')

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      address: createUserDto.address
    });
    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.userModel.findOne({
        _id: id
      });
    }else {
      return 'Not Found user';
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id: updateUserDto._id}, {...updateUserDto});
  }

  remove(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.userModel.deleteOne({_id: id});
    }else {
      return 'Not Found User';
    }
  }
}
