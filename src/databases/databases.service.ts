import { Injectable, Logger, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ADMIN_ROLE, USER_ROLE } from 'src/constant/role';
import { Permission, PermissionDocument } from 'src/permission/schema/permission.schema';
import { Role, RoleDocument } from 'src/role/entities/role.entity';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);

    constructor(
        @InjectModel(User.name) 
        private userModel: SoftDeleteModel<UserDocument>,

        @InjectModel(Permission.name) 
        private permissionModel: SoftDeleteModel<PermissionDocument>,

        @InjectModel(Role.name) 
        private roleModel: SoftDeleteModel<RoleDocument>,

        private configService: ConfigService,

        private userService: UsersService,
    ) {}

    async onModuleInit() {
        const isInit = this.configService.get<string>("SHOULD_INIT");

        if (Boolean(isInit)) {
            const countUser = await this.userModel.countDocuments({});
            const countPermission = await this.permissionModel.countDocuments({});
            const countRole = await this.roleModel.countDocuments({});

            if (countPermission === 0) {
                await this.permissionModel.insertMany([]);
            }

            if (countRole === 0) {
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: 'Admin full quyền',
                        isActive: true
                    },
                    {
                        name: USER_ROLE,
                        description: 'Người dùng/ứng viên sử dụng hệ thống',
                        isActive: true,
                        permissions: []
                    }
                ])
            }

            if (countUser === 0) {
                const adminRole = await this.roleModel.findOne({name: ADMIN_ROLE});
                const userRole = await this.roleModel.findOne({name: USER_ROLE});

                await this.userModel.insertMany([
                    {
                        name: 'Admin 1',
                        email: 'admin1@gmail.com',
                        password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
                        age: 69,
                        gender: 'MALE',
                        address: 'VietNam',
                        role: adminRole?.id
                    },
                    {
                        name: 'Việt',
                        email: 'phoquocviet@gmail.com',
                        password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD')),
                        age: 69,
                        gender: 'MALE',
                        address: 'VietNam',
                        role: userRole?.id
                    }
                ])
            }

            if (countUser > 0 && countRole > 0 && countPermission > 0) {
                this.logger.log('>>> ALREADY INIT SAMPLE DATA');
            }
        }
    }

}
