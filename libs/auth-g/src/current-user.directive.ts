import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from './current-user.dto';

const getCurrentUserByContext = (ctx: ExecutionContext): CurrentUserDto => {
  return ctx.switchToHttp().getRequest().user;
};
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);