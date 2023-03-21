import Head from 'next/head';
import Image from 'next/image';

const HomePage = () => {
	const handleCreateNewRoom = () => {
		// TODO: create the room
	};

	return (
		<>
			<Head>
				<title>Principle Studios presents Planning Poker</title>
				<meta name="description" content="Principle Studios presents Planning Poker per Project Pointing" />
			</Head>

			<div className="min-h-full flex items-center justify-center">
				<div className="max-w-md w-full">
					<div className="block mx-auto mb-1" style={{ lineHeight: 0 }}>
						<Image src="/assets/principle-logo.svg" alt="Workflow" layout="fixed" width={168} height={100} />
					</div>

					<div className="bg-white text-black pt-12 px-6 pb-8">
						<h2 className="font-title text-4xl font-bold tracking-tight mb-6">planning poker</h2>

						<form className="space-y-8">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non convallis erat. Suspendisse quis
								dapibus elit. Etiam iaculis sem tortor, eu sodales elit efficitur at.
							</p>

							<button
								type="submit"
								className="relative w-full flex justify-center py-3 px-4 border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								onClick={handleCreateNewRoom}>
								Create New Room
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
