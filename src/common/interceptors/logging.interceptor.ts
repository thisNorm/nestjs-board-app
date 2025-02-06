import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class loggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(loggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();

        this.logger.log(`Request Method: ${method}, URL: ${url}`);

        return next.handle().pipe(
            tap(() => {
                const responseTime = Date.now() - now;
                this.logger.log(`Response for: ${method} ${url} - ${responseTime}ms`);
            })
        )
    }
}
