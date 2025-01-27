import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpInterceptorFn }
  from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../service/session.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private oSessionService: SessionService) { }

    intercept(req : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {

      if (this.oSessionService.isSessionActive()) {
        const token = this.oSessionService.getToken();
        if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
        }
      }
    return next.handle(req);
  }
}