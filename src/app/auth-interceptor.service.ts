import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor{
      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            //if(req.url)
            console.log("Request is on its way");
            const modifiedRequest = req.clone({headers:req.headers.append('Auth','xyz')});
            return next.handle(modifiedRequest).pipe(
                  tap(
                        event=>{
                              console.log("response in interceptors: ",event);
                              if(event.type ===  HttpEventType.Response){
                                    console.log("Response arrived in interceptor:");
                                    console.log(event.body);
                              }
                        }
                  )
            );
      }
      
}