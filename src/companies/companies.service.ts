import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

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

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs); //hàm lấy tham số từ request để phục vụ phân trang. Trong đó thuộc tính filter lưu các query string 
    delete filter.page;
    delete filter.limit;

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.companyModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    }
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
