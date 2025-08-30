import { Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDTO } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

enum STATUS {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  APPROVED = 'APPROVED',
  REJECT = 'REJECT'
}
@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private readonly resumeModel: SoftDeleteModel<ResumeDocument>) {}

  create(createResumeDto: CreateUserCvDTO, user: IUser) {
    return this.resumeModel.create({
      email: user.email,
      userId: user._id,
      status: STATUS.PENDING,
      createdBy: {
        _id: user._id,
        email: user.email
      },
      history: [{
        status: STATUS.PENDING,
        updatedAt: Date.now(),
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }],
      ...createResumeDto
    });
  }

  async findAll(current: number, limit: number, qs: string) {
    const {filter, population, projection} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    var offset = (current - 1) * limit;
    limit = limit ? limit : 10;

    return this.resumeModel.find(filter)
                    .skip(offset)
                    .limit(limit)
                    .select(projection)
                    .populate(population)
                    .exec();
  }

  findOne(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.resumeModel.findById(id);
    }
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return await this.resumeModel.updateOne({_id: id}, {
          status: updateResumeDto.status,
          $push: {
            history: {
              status: updateResumeDto.status,
              updatedAt: new Date(),
              updatedBy: {
                _id: user._id,
                email: user.email
              }
            }
          }
        })
    }
  }

  async remove(id: string, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await this.resumeModel.updateOne({_id: id}, {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });

      return await this.resumeModel.softDelete({_id: id});
    }
  }

  async getCvByUser(user: IUser) {
    return await this.resumeModel.find({userId: user._id});
  }
}
