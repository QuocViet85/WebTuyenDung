import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDTO } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createResumeDto: CreateUserCvDTO, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all resumes')
  findAll(@Query('current') current: number, @Query('limit') limit: number, @Query() qs: string) {
    return this.resumesService.findAll(+current, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch resume by Id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUser) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }

  @Post('by-user')
  getCVByUser(@User() user: IUser) {
    return this.resumesService.getCvByUser(user)
  }
}
