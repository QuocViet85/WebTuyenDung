import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/role.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private readonly roleModel: SoftDeleteModel<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const roleExist = await this.roleModel.findOne({name: createRoleDto.name});
    if (roleExist) {
      throw new BadRequestException('Role với name này đã tồn tại');
    }

    return await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        name: user.name
      }
    })
  }

  async findAll(pageNumber: number, limit: number, qs: string) {
    const {filter, population, projection} = aqp(qs);

    const offset = (pageNumber - 1) * limit;
    limit = limit ? limit : 10;

    return await this.roleModel.find(filter)  
                                .skip(offset)
                                .limit(limit)
                                .populate(population)
                                .exec();
  }

  async findOne(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.roleModel.findOne({_id: id}).populate({path: 'permissions', select: { id: 1, apiPath: 1, name: 1, method: 1, module: 1}});
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const roleExits = await this.roleModel.findOne({name: updateRoleDto.name});

      if (roleExits && roleExits._id.toString() !== id) {
        throw new BadRequestException('Role với name này đã tồn tại');
      }

      return await this.roleModel.updateOne({_id: id}, {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          name: user.name
        }
      })
    }
  }

  async remove(id: string, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const foundRole = await this.roleModel.findById(id);

      if (foundRole.name === 'ADMIN') {
        throw new BadRequestException('Không thể xóa role ADMIN');
      }
      await this.roleModel.updateOne({_id: id}, {
        deletedBy: {
          _id: user._id,
          name: user.name
        }
      });

      return await this.roleModel.softDelete({_id: id});
    }
  }
}
