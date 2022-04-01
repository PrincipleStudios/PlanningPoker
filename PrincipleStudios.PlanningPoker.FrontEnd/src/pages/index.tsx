import Head from 'next/head';
import { VersionInfo } from 'src/components/version-info';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Principle Studios presents Planning Poker</title>
        <meta name="description" content="Principle Studios presents Planning Poker per Project Pointing" />
      </Head>

      Hello World.

      <VersionInfo />
    </div>
  );
}
