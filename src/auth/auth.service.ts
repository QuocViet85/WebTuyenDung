import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService 
    ) {}

    //username, password là 2 tham số thư viện passport ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            const isValidPassword = this.usersService.isValidPassword(pass, user.password);
            if (isValidPassword) {
                return user;
            }
        }
        return null;
    }

    async register(registerUserDto: RegisterUserDto) {
        let newUser = await this.usersService.register(registerUserDto);

        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }

    async login(user: IUser, res: Response) {
        const {_id, name, email, role} = user;
        const payload = { 
            sub: 'token login',
            iss: 'from server',
            _id,
            name,
            email, 
            role
        };

        const refresh_token = this.createdRefreshToken(payload);
        
        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id);
        
        //set refresh_token as cookies
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
        });


        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role
          }
        };
    }

    async logout(user: IUser, res: Response) {
        await this.usersService.updateUserToken(null, user._id);
        res.clearCookie('refresh_token');
    }

    createdRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000
        });
        return refresh_token;
    }

    processNewToken = async (refreshToken: string, res: Response) => {
        try {
            //dùng hàm verify để giải mã token và có kiểm tra chữ kí để bảo mật (hàm decode chỉ giải mã nhưng không kiểm tra chữ kí)
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            });

            let user = await this.usersService.findUserByToken(refreshToken);
            
            if (user) {
                //update refreshToken
                let userInfo = {
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                }

                return await this.login(userInfo, res);
            }else {
                throw new BadRequestException('Refresh token không hợp lệ. Vui lòng login.')
            }
        }catch (error) {
            throw new BadRequestException('Refresh token không hợp lệ. Vui lòng login.')
        }
    }
}
