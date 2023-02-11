import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRole } from '../enums/valid-roles.enum';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: ValidRole[]) {
    return applyDecorators(
          RoleProtected(...roles),
          UseGuards(AuthGuard(), UserRoleGuard)
    );
}