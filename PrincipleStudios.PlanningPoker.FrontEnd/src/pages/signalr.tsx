import Head from 'next/head';
import { useEffect, useReducer, useState } from 'react';
import { useSignalRConnection } from 'src/core/utils/use-signalr';

export default function SignalRDemo() {
	const [userName, setUserName] = useState('New User');
	const [message, setMessage] = useState('');
	const [connection, connected] = useSignalRConnection('/api/chat');
	const [messages, addMessage] = useReducer(
		(prev: { user: string; message: string }[], next: { user: string; message: string }) => {
			return [...prev, next];
		},
		[]
	);

	useEffect(() => {
		if (!connection) return () => {};
		connection.on('ReceiveMessage', (user, incommingMessage) => addMessage({ user, message: incommingMessage }));

		return () => connection.off('ReceiveMessage');
	}, [connection, addMessage]);

	async function sendMessage() {
		if (!(await connected)) return;
		connection.send('SendMessage', userName, message);
		setMessage('');
	}

	return (
		<div>
			<Head>
				<title>SignalR Demo Page</title>
			</Head>
			<div>
				<div className="m-4">
					<label className="flex flex-row">
						<span className="inline-block w-64">Username</span>
						<input
							type="text"
							className="border border-black p-1"
							value={userName}
							onChange={(ev) => setUserName(ev.currentTarget.value)}
						/>
					</label>
					<label className="flex flex-row">
						<span className="inline-block w-64">Message</span>
						<input
							type="text"
							className="border border-black p-1"
							value={message}
							onChange={(ev) => setMessage(ev.currentTarget.value)}
						/>
					</label>
					<button type="button" className="border border-black bg-blue-900 text-white p-2" onClick={sendMessage}>
						Send
					</button>
				</div>

				<div className="flex flex-col-reverse m-4">
					{messages.map(({ user, message: oldMessage }, index) => (
						<p key={index} className="even:bg-slate-300">
							<span className="font-bold">{user}: </span> {oldMessage}
						</p>
					))}
				</div>
			</div>
		</div>
	);
}
