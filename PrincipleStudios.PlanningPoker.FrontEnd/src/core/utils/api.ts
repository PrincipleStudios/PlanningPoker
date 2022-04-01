import log from 'loglevel';
import { Context, createContext, useContext } from 'react';
import { Observable } from 'rxjs';
import { ajax, AjaxConfig, AjaxResponse } from 'rxjs/ajax';
import { tap } from 'rxjs/operators';
import operations from 'src/api/operations';
import { toRxjsApi } from './rxjs-api';

const withLogin: (params: AjaxConfig) => Observable<AjaxResponse<unknown>> = (request) =>
	ajax(request).pipe(
		tap({ next: (response) => log.debug({ response, request }), error: (err) => log.error({ err, request }) })
	);

export const apiContext = createContext(toRxjsApi(operations, '/api', withLogin));

export type DotNetApi = typeof apiContext extends Context<infer T> ? T : never;

export function useApi(): DotNetApi {
	const apiContextValue = useContext(apiContext);
	return apiContextValue;
}
