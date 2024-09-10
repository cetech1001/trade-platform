import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { Account, UserRole } from '@coinvant/types';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		const { user, query } = context.switchToHttp().getRequest();

		if (user.role === UserRole.user && query.accountID) {
			if (!user.accounts.find((a: Account) => a.id === query.accountID)) {
				throw new ForbiddenException('You do not have permission to access this resource');
			}
		}

		if (!requiredRoles) {
			return true;
		}

		if (!requiredRoles.includes(user.role)) {
			throw new ForbiddenException('You do not have permission to access this resource');
		}

		return true;
	}
}
