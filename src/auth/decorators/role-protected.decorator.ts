import { SetMetadata } from '@nestjs/common';
import { ValidRole } from '../enums/valid-roles.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRole[]) => SetMetadata(META_ROLES, args);
