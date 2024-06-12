import { HttpInterceptorFn } from '@angular/common/http'; 
import { CONSTANT } from 'src/constants/constants';  

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const mytoken = localStorage.getItem(CONSTANT.TOKEN_KEY);

  if (mytoken) {
    const cloneRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${mytoken}`
      }
    });
    return next(cloneRequest);
  }

  return next(req);
};