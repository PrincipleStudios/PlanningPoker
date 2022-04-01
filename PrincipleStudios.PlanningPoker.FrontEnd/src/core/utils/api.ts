import log from 'loglevel';
import { Context, createContext, useContext } from 'react';
import { NEVER, Observable, throwError } from 'rxjs';
import { ajax, AjaxError, AjaxConfig, AjaxResponse } from 'rxjs/ajax';
import { catchError, tap } from 'rxjs/operators';
import operations from 'src/api/operations';
import { toRxjsApi } from './rxjs-api';

const withLogin: (params: AjaxConfig) => Observable<AjaxResponse<unknown>> = (request) =>
	ajax(request).pipe(
		tap({ next: (response) => log.debug({ response, request }), error: (err) => log.error({ err, request }) }),
		catchError((error: AjaxError) => {
			if (error.status !== 401) return throwError(() => error);

			window.location.href = `/api/login?returnUrl=${encodeURIComponent(
				window.location.pathname + window.location.search + window.location.hash
			)}`;

			return NEVER;
		})
	);

export const apiContext = createContext(toRxjsApi(operations, '/api', withLogin));

export type DotNetApi = typeof apiContext extends Context<infer T> ? T : never;

export function useApi(): DotNetApi {
	const apiContextValue = useContext(apiContext);
	return apiContextValue;
}
