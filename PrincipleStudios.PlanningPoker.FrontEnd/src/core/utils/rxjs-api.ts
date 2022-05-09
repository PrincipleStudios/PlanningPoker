import {
	RequestBodies,
	RequestConversion,
	StandardResponse,
	TransformCallType,
	RequestOpts,
	RequestConversions,
} from '@principlestudios/openapi-codegen-typescript';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ajax, AjaxConfig, AjaxError, AjaxResponse } from 'rxjs/ajax';
import { toUrl, RequestParam } from './api';

function rxWithPrefix(prefix: string, rxjsRequest: (params: AjaxConfig) => Observable<AjaxResponse<unknown>> = ajax) {
	const createRequestArgs = (requestOpts: RequestOpts): AjaxConfig => {
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

	return function fetchRequest<
		TParams extends {},
		TBody extends RequestBodies,
		TResponse extends StandardResponse,
		TCallType extends TransformCallType
	>(conversion: RequestConversion<TParams, TBody, TResponse, TCallType>) {
		function transform({ params = {}, body = undefined, mimeType = undefined }: any = {}): Observable<TResponse> {
			const requestOpts: RequestOpts = conversion.request(
				params,
				body,
				mimeType || (body ? 'application/json' : undefined)
			);
			return rxjsRequest(createRequestArgs(requestOpts)).pipe(
				catchError((ex: AjaxError) => of(ex)),
				map((response) =>
					conversion.response({
						status: response.status,
						response: response.response,
						getResponseHeader(header) {
							return response.xhr.getResponseHeader(header);
						},
					})
				)
			);
		}
		return transform;
	};
}

type Converted<TConversion extends RequestConversion<any, any, any, any>> = TConversion extends RequestConversion<
	infer TParams,
	infer TBodies,
	infer TResponse,
	infer TCallType
>
	? {} extends RequestParam<TParams, TBodies, keyof TBodies, TCallType>
		? <Mime extends keyof TBodies>(req?: RequestParam<TParams, TBodies, Mime, TCallType>) => Observable<TResponse>
		: <Mime extends keyof TBodies>(req: RequestParam<TParams, TBodies, Mime, TCallType>) => Observable<TResponse>
	: never;

export function applyTransform<TMethods extends RequestConversions>(
	methods: TMethods,
	transform: (input: RequestConversion<any, any, any, any>) => Converted<RequestConversion<any, any, any, any>>
): {
	[K in keyof TMethods]: Converted<TMethods[K]>;
} {
	return Object.keys(methods).reduce(
		(prev, next) => ({ ...prev, [next]: transform(methods[next]) }),
		{} as {
			[K in keyof TMethods]: Converted<TMethods[K]>;
		}
	);
}

export function toRxjsApi<TMethods extends RequestConversions>(
	api: TMethods,
	prefix = '',
	rxjsRequest: (params: AjaxConfig) => Observable<AjaxResponse<unknown>> = ajax
) {
	return applyTransform(api, rxWithPrefix(prefix, rxjsRequest)); // TODO
}
