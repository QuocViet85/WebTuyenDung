import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import mongoose from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: SoftDeleteModel<CompanyDocument>
  ) {}

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    let company = this.companyModel.create({...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return company;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.companyModel.updateOne({_id: id}, {...updateCompanyDto, updatedBy: {
      _id: user._id,
      email: user.email
    }});
  }

  async remove(id: string, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await this.companyModel.updateOne({_id: id}, {deletedBy: {
        _id: user._id,
        email: user.email
      }}); //hàm updateOne() phải hoàn thành trước khi thi hành hàm softDelete() thì việc update mới có hiệu lực. Vì nếu để softDelete() thi hành trước thì updateOne() sẽ không tìm thấy bản ghi để update do hàm updateOne() bỏ qua bản ghi bị xóa mềm (có trường isDeleted=true)
      return this.companyModel.softDelete({_id: id});
    }else {
      return 'Company Not Found';
    }
  }
}
