import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const cache = new Map<string, HttpResponse<unknown>>();

/** Caches GET responses and clears cached entries when a non-GET request is made. */
export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    cache.clear();
    return next(req);
  }

  const cached = cache.get(req.urlWithParams);
  if (cached) {
    return of(cached.clone());
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(req.urlWithParams, event);
      }
    }),
  );
};
