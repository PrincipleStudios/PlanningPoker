import { VersionInfo } from 'src/components/version-info';
import HomePage from './home/home';

export default function Home() {
	return (
		<main className="bg-black h-screen">
			<HomePage />

			<div className="absolute bottom-0 left-0">
				<VersionInfo />
			</div>
		</main>
	);
}
