import {
	RequestBodies,
	RequestConversion,
	StandardResponse,
	TransformCallType,
	RequestOpts,
	RequestConversions,
} from '@principlestudios/openapi-codegen-typescript';

import { createRequestArgs, RequestParam } from './api';

function rxWithPrefix(prefix: string, request: (input: RequestInfo, init?: RequestInit) => Promise<Response> = fetch) {
	return function fetchRequest<
		TParams extends {},
		TBody extends RequestBodies,
		TResponse extends StandardResponse,
		TCallType extends TransformCallType
	>(conversion: RequestConversion<TParams, TBody, TResponse, TCallType>) {
		function transform({ params = {}, body = undefined, mimeType = undefined }: any = {}): Promise<TResponse> {
			const requestOpts: RequestOpts = conversion.request(
				params,
				body,
				mimeType || (body ? 'application/json' : undefined)
			);

			const requestArgs = createRequestArgs(prefix, requestOpts);

			return request(requestArgs.url, requestArgs)
				.then((response) =>
					conversion.response({
						status: response.status,
						response: response.json(),
						getResponseHeader(header) {
							return response.headers.get(header);
						},
					})
				)
				.catch((x) => x);
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
		? <Mime extends keyof TBodies>(req?: RequestParam<TParams, TBodies, Mime, TCallType>) => Promise<TResponse>
		: <Mime extends keyof TBodies>(req: RequestParam<TParams, TBodies, Mime, TCallType>) => Promise<TResponse>
	: never;

function applyTransform<TMethods extends RequestConversions>(
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

export function toFetchApi<TMethods extends RequestConversions>(
	api: TMethods,
	prefix = '',
	fetchRequest: (input: RequestInfo, init?: RequestInit) => Promise<Response> = fetch
) {
	return applyTransform(api, rxWithPrefix(prefix, fetchRequest)); // TODO
}
