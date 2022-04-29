import { Observable } from 'rxjs';
import { useState, useEffect } from 'react';

export function useObservable<State>(inputFactory: () => Observable<State>): State | undefined;
export function useObservable<State>(inputFactory: () => Observable<State>, initialState: State): State;
export function useObservable<State>(inputFactory: () => Observable<State>, initialState?: State): State | undefined {
	const [state, setState] = useState(initialState);

	useEffect(() => {
		const subscription = inputFactory().subscribe((value) => {
			setState(() => value);
		});
		return () => {
			subscription.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // immutable forever

	return state;
}
