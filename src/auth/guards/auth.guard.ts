import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ){}

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log({request})
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No valid token on request');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {secret: process.env.JWT_SEED}
      );

      const user = await this.authService.findUserById(payload.id);
      console.log(user)
      if( !user ) throw new UnauthorizedException('User does not exist');
      if( !user.isActive ) throw new UnauthorizedException('User is not active.');

      //This was done just so we can see the user information encrypted in the Jwt which is the user id

      console.log({payload})
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user;

    } catch(err) {
      throw new UnauthorizedException(err);
    }
    return true;
    // return Promise.resolve(true)
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
