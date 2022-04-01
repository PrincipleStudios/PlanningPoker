import { Observable, BehaviorSubject } from 'rxjs';
import { useState, useEffect, DependencyList } from 'react';
import useConstant from 'use-constant';

export type InputFactory<State> = (state$: Observable<State>) => Observable<State>;
export type InputFactoryWithInputs<State, Inputs extends DependencyList> = (
	state$: Observable<State>,
	inputs$: Observable<Inputs>
) => Observable<State>;

export function useObservable<State>(inputFactory: InputFactory<State>): State | null;
export function useObservable<State>(inputFactory: InputFactory<State>, initialState: State): State;
export function useObservable<State, Inputs extends DependencyList>(
	inputFactory: InputFactoryWithInputs<State, Inputs>,
	initialState: State,
	inputs: Inputs
): State;
export function useObservable<State, Inputs extends ReadonlyArray<unknown>>(
	inputFactory: InputFactoryWithInputs<State, Inputs>,
	initialState?: State,
	inputs?: Inputs
): State | null {
	const [state, setState] = useState(typeof initialState !== 'undefined' ? initialState : null);

	const state$ = useConstant(() => new BehaviorSubject<State | undefined>(initialState));
	const inputs$ = useConstant(() => new BehaviorSubject<Inputs | undefined>(inputs));

	useEffect(() => {
		inputs$.next(inputs);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputs$, ...(inputs || [])]);

	useEffect(() => {
		let output$: BehaviorSubject<State>;
		if (inputs) {
			output$ = (
				inputFactory as (
					state$: Observable<State | undefined>,
					inputs$: Observable<Inputs | undefined>
				) => Observable<State>
			)(state$, inputs$) as BehaviorSubject<State>;
		} else {
			output$ = (inputFactory as unknown as (state$: Observable<State | undefined>) => Observable<State>)(
				state$
			) as BehaviorSubject<State>;
		}
		const subscription = output$.subscribe((value) => {
			state$.next(value);
			setState(value);
		});
		return () => {
			subscription.unsubscribe();
			inputs$.complete();
			state$.complete();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // immutable forever

	return state;
}
