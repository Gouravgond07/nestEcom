import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthGuard } from "@nestjs/passport";
import { catchError, firstValueFrom, map, Observable, of, tap } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('JwtAuthGuard canActivate called');
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log('Token:', token);
    if (!token) {
      return false;
    }
    return this.client.send({ cmd: 'VALIDATE_TOKEN' }, { token })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest<Request>()['user'] = res;
        }),
        map(() => true),
        catchError(() => of(false)),
      )
  }
}