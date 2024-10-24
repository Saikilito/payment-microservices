import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Core, Modules } from '@pay-ms/nest-modules';
import { envs } from '../../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authDatabase: Modules.Prisma.PrismaAuthService
  ) {}

  async register(registerDto: Core.DTO.Auth.RegisterDTO) {
    try {
      const userExist = await this.authDatabase.user.findUnique({
        where: {
          email: registerDto.email,
        },
      });

      if (userExist) {
        throw new RpcException({
          status: 400,
          message: 'User already exist',
        });
      }

      const user = await this.authDatabase.user.create({
        data: {
          email: registerDto.email,
          name: registerDto.name,
          password: bcrypt.hashSync(registerDto.password, 10),
        },
      });

      const { password: __, ...rest } = user;

      return { user: rest };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async login(loginDto: Core.DTO.Auth.LoginDTO) {
    const { email, password } = loginDto;

    const userExist = await this.authDatabase.user.findUnique({
      where: {
        email,
      },
    });

    if (!userExist) {
      throw new RpcException({
        status: 400,
        message: 'User/Password not valid',
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, userExist.password);

    if (!isPasswordValid) {
      throw new RpcException({
        status: 400,
        message: 'User/Password not valid',
      });
    }

    const { password: __, ...rest } = userExist;

    const token = this.jwtService.sign({
      id: userExist.id,
      email: userExist.name,
    });

    return { user: rest, token };
  }

  async verifyToken(token: string) {
    try {
      const {
        iat: _,
        exp: __,
        ...user
      } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      const newToken = this.jwtService.sign(user);

      return { user, token: newToken };
    } catch (error) {
      console.error(error);
      throw new RpcException({
        status: 401,
        message: 'Invalid Token',
      });
    }
  }
}
