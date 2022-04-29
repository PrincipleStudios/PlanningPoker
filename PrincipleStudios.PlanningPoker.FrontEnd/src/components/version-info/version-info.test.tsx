import { render } from '@testing-library/react';
import { VersionInfo } from './version-info';

describe('version-info component', () => {
	it('renders the provided gitHash version', () => {
		const { baseElement } = render(<VersionInfo gitHash="some-git-hash" />);
		expect(baseElement).toMatchSnapshot();
	});
});
