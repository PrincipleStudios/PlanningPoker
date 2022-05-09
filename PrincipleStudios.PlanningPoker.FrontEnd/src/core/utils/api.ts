import log from 'loglevel';
import {
	HttpQuery,
	RequestOpts,
	encodeURI,
	RequestBodies,
	TransformCallType,
} from '@principlestudios/openapi-codegen-typescript';
import { createContext, useContext } from 'react';
import { Observable } from 'rxjs';
import { ajax, AjaxConfig, AjaxResponse } from 'rxjs/ajax';
import { tap } from 'rxjs/operators';
import operations from 'src/api/operations';
import { toRxjsApi } from './rxjs-api';
import { toFetchApi } from './fetch-api';

export const queryString = (params: HttpQuery): string =>
	Object.keys(params)
		.map((key) => {
			const value = params[key];
			return value instanceof Array
				? value.map((val) => `${encodeURI(key)}=${encodeURI(val)}`).join('&')
				: `${encodeURI(key)}=${encodeURI(value)}`;
		})
		.join('&');

export const toUrl = (prefix: string, requestOpts: RequestOpts) =>
	`${prefix}${requestOpts.path}${requestOpts.query ? `?${queryString(requestOpts.query)}` : ''}`;

export const createRequestArgs = (prefix: string, requestOpts: RequestOpts): AjaxConfig => {
	const url = toUrl(prefix, requestOpts);

	return {
		url,
		method: requestOpts.method,
		headers: requestOpts.headers,
		body:
			requestOpts.headers && requestOpts.headers['Content-Type'] === 'application/x-www-form-urlencoded'
				? requestOpts.body
				: JSON.stringify(requestOpts.body),
		responseType: requestOpts.responseType || 'json',
	};
};

const withLogin: (params: AjaxConfig) => Observable<AjaxResponse<unknown>> = (request) =>
	ajax(request).pipe(
		tap({ next: (response) => log.debug({ response, request }), error: (err) => log.error({ err, request }) })
	);

export type ParamPart<TParams> = {} extends TParams ? { params?: TParams } : { params: TParams };
export type BodyPartInner<TBodies extends RequestBodies, Mime extends keyof TBodies> = Mime extends 'application/json'
	? { body: TBodies['application/json']; mimeType?: 'application/json' }
	: { body: TBodies[Mime]; mimeType: Mime };
export type BodyPart<
	TBodies extends RequestBodies,
	Mime extends keyof TBodies,
	TCallType extends TransformCallType
> = TCallType extends 'no-body'
	? {}
	: TCallType extends 'optional'
	? BodyPartInner<TBodies, Mime> | {}
	: BodyPartInner<TBodies, Mime>;

export type RequestParam<
	TParams,
	TBodies extends RequestBodies,
	Mime extends keyof TBodies,
	TCallType extends TransformCallType
> = ParamPart<TParams> & BodyPart<TBodies, Mime, TCallType>;

export const apiContext = createContext({
	rxjs: toRxjsApi(operations, '', withLogin),
	fetch: toFetchApi(operations, ''),
});

// export type DotNetApi = typeof rxJsApiContext extends Context<infer T> ? T : never;

export function useApi() {
	const apiContextValue = useContext(apiContext);

	return apiContextValue;
}
