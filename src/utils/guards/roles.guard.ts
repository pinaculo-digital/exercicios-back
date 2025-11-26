import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppErrorForbidden, AppErrorUnauthorized } from 'src/utils/errors/app-errors';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IRequestUser } from 'src/core/modules/common/modules/auth/authentication/auth.interfaces';
import { UserRole } from 'generated/prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    let hasAccess = false;

    const roles =
      this.reflector.get<string[]>(ROLES_KEY, context.getClass()) ??
      this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: IRequestUser = request.user;

    if (!user) {
      throw new AppErrorUnauthorized('Usuário não autenticado');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    hasAccess = roles.includes(user.role);

    if (!hasAccess) {
      throw new AppErrorForbidden('Usuário não possui permissão para acessar este recurso');
    }

    return hasAccess;
  }
}
