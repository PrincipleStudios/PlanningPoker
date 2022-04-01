import { map } from 'rxjs/operators';
import { useApi } from 'src/core/utils/api';
import { useObservable } from 'src/core/utils/use-observable';
import { VersionInfo } from './version-info';

export function VersionInfoContainer() {
	const api = useApi();
	const infoApiCall = api.getInfo();

	const value = useObservable(
		() => infoApiCall.pipe(map((response) => (response.statusCode === 200 ? response.data : {}))),
		{ gitHash: 'local' }
	);

	if (value == null) return null;

	return <VersionInfo environmentInfo={value} />;
}
