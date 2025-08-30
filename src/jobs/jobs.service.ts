import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    let newJob = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });

    return {
      id: newJob._id,
      name: newJob.name
    }
  }

  findAll(currentPage: number, limit: number) {
    let offset = (currentPage - 1) * limit;
    limit = limit ? limit : 10;
    return this.jobModel.find({}).skip(offset).limit(limit);
  }


  findOne(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.jobModel.find({_id: id});
    }
  }

  update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
      return this.jobModel.updateOne({_id: id}, {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  async remove(id: string, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await this.jobModel.updateOne({_id: id}, {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });

      return await this.jobModel.softDelete({_id: id});
    }
  }
}
