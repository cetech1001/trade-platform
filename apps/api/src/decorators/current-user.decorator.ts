import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {User} from "@coinvant/types";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User | null;
  }
);
