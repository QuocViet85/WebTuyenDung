import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ResponseMessage('Create a permission')
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all permissions')
  findAll(@Query('page')pageNumber: number, @Query('limit') limit: number, @Query() qs: string) {
    return this.permissionService.findAll(pageNumber, limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a permission')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a permission')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a permission')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionService.remove(id, user);
  }
}
