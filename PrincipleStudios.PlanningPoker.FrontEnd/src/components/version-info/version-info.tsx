import { EnvironmentInfoResponse } from 'src/api/models/EnvironmentInfoResponse';

export function VersionInfo({ environmentInfo }: { environmentInfo: EnvironmentInfoResponse }) {
	return (
		<>
			<dl>
				<dt>Git Commit Hash:</dt>
				<dd>{environmentInfo.gitHash}</dd>
			</dl>
		</>
	);
}
