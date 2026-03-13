import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    return {
      message: '登录成功',
      token: 'fake-jwt-token',
      user: { id: 1, email: loginDto.email },
    };
  }

  async register(loginDto: LoginDto) {
    return {
      message: '注册成功',
      user: { id: 1, email: loginDto.email },
    };
  }
}
