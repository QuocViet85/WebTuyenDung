import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose, { Types } from 'mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission.name) private readonly permissionModel: SoftDeleteModel<PermissionDocument>) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const permissionExist = await this.permissionModel.findOne({apiPath: createPermissionDto.apiPath, method: createPermissionDto.method});

    if (permissionExist) {
      throw new BadRequestException('Permission với apiPath và method này đã tồn tại')
    }

    return this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  findAll(pageNumber: number, limit: number, qs: string) {
    const {filter, population, projection} = aqp(qs);

    const offset = (pageNumber - 1) * limit;
    limit = limit ? limit : 10;

    return this.permissionModel.find(filter)
                                .skip(offset)
                                .limit(limit)
                                .projection(projection)
                                .populate(population)
                                .exec();
  }

  findOne(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.permissionModel.find({id: id});
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const permissionExist = await this.permissionModel.findOne({apiPath: updatePermissionDto.apiPath, method: updatePermissionDto.method});

      if (permissionExist && permissionExist._id.toString() !== id) {
        throw new BadRequestException('Permission với apiPath và method này đã tồn tại')
      }

      return await this.permissionModel.updateOne({_id: id}, {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
    }
  }

  async remove(id: string, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await this.permissionModel.updateOne({_id: id}, {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });

      return await this.permissionModel.softDelete({_id: id});
    }
  }
}
