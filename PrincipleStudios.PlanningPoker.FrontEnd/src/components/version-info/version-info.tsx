import { map } from 'rxjs/operators';
import { useApi } from 'src/core/utils/api';
import { useObservable } from 'src/core/utils/use-observable';

export function VersionInfo() {
	const api = useApi();
	const infoApiCall = api.getInfo();

	const value = useObservable(
		() => infoApiCall.pipe(map((response) => (response.statusCode === 200 ? response.data : {}))),
		{ gitHash: 'local' }
	);

	if (value == null) return null;

	return (
		<>
			<dl>
				<dt>Git Commit Hash:</dt>
				<dd>{value.gitHash}</dd>
			</dl>
		</>
	);
}
