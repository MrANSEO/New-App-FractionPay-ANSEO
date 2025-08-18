import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  login(dto: LoginDto) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, dto.email, dto.password).catch((e) => {
      throw new UnauthorizedException(e);
    });
  }

  refreshToken(dto: RefreshTokenDto) {
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`;

    return axios
      .post<unknown, AxiosResponse<string>>(url, {
        grant_type: 'refresh_token',
        refresh_token: dto.refreshToken,
      })
      .then((res) => res.data)
      .catch((e: AxiosError<AxiosResponse>) => {
        throw new UnauthorizedException({
          name: e.name,
          code: e.code,
          status: e.response?.status,
          message: e.message,
        });
      });
  }
}
