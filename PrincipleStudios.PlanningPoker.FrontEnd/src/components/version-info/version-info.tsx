import { EnvironmentInfoResponse } from 'src/api/models/EnvironmentInfoResponse';

export function VersionInfo({ gitHash }: EnvironmentInfoResponse) {
	return (
		<>
			<dl className="grid grid-cols-2">
				<dt className="font-bold">Git Commit Hash:</dt>
				<dd>{gitHash}</dd>
			</dl>
		</>
	);
}
