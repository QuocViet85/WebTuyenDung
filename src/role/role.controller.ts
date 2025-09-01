import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ResponseMessage('Create a role')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.roleService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all roles')
  findAll(@Query('page') pageNumber: number, @Query('limit') limit: number, @Query() qs: string) {
    return this.roleService.findAll(pageNumber, limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch one role')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a role')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.roleService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a role')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.roleService.remove(id, user);
  }
}
