import { useQuery } from 'react-query';
import { map } from 'rxjs/operators';
import { useApi } from 'src/core/utils/api';
import { useObservable } from 'src/core/utils/use-observable';
import { VersionInfo } from './version-info';

export function VersionInfoContainer() {
	const api = useApi();
	const infoApiCall = api.rxjs.getInfo();

	// WIP: Testing react query with API setup
	const fetchInfoApiCall = api.fetch.getInfo();
	const query = useQuery('todos', () => fetchInfoApiCall);

	console.log(query);

	const value = useObservable(
		() => infoApiCall.pipe(map((response) => (response.statusCode === 200 ? response.data : {}))),
		{ gitHash: 'local' }
	);

	if (value == null) return null;

	return <VersionInfo {...value} />;
}
