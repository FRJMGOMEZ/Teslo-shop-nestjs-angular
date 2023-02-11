import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private readonly reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();

    const user = req.user;

    if(!user)throw new InternalServerErrorException('User not found (request)');

    const roles = user.roles;

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if(!validRoles || validRoles.length === 0)return true;

    if (!validRoles.find((role) => roles.includes(role)))throw new UnauthorizedException(`User ${user.fullName} has not valid roles.`);
    
    return true;
  }
}
