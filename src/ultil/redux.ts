import React from 'react';

export interface Reducer<S, A extends Action<any, any>> {
  (state: S | undefined, action: A): S;
}

export interface Listener {
  (): void;
}

export interface Action<T, P> {
  type: T;
  payload: P;
}

export class Store<S, A extends Action<any, any>> {
  private _state?: S;
  private _listeners: Listener[];
  constructor(private _reducer: Reducer<S, A>, _initialState?: S) {
    this._state = _initialState || _reducer(undefined, {} as A);
    this._listeners = [];

    this.subscribe = this.subscribe.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  getState() {
    return this._state;
  }

  dispatch(action: A) {
    this._state = this._reducer(this._state, action);
    this._listeners.forEach((listener) => listener());
  }

  subscribe(listener: Listener) {
    this._listeners.push(listener);

    return () => {
      this.unsubscribe(listener);
    };
  }

  unsubscribe(listener: Listener) {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }
}

export function createStore<S, A extends Action<any, any>>(
  reducer: Reducer<S, A>,
  initialState?: S,
): Store<S, A> {
  return new Store(reducer, initialState);
}

export function combineReducer(...reducers: Reducer<any, any>[]) {
  return (state: any, action: any) => {
    return reducers.reduce((acc, reducer) => {
      const prevState = acc;

      return reducer(prevState, action);
    }, state);
  };
}

// For react
const Context = React.createContext({} as Store<any, any>);

export const Provider = Context.Provider;

export const useStore = () => {
  return React.useContext(Context);
};

export const useDispatch = () => {
  const store = useStore();
  return store.dispatch;
};

export const useSelector = <S, T>(selector: (state: S) => T) => {
  const store = useStore();

  return React.useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    // () => undefined,
  );
};
