import { useCallback, useEffect } from 'react';

export type Listener<T> = (data: T) => void;

export class EventEmitter<E extends Record<string, any> = Record<string, any>> {
  private events;
  constructor() {
    this.events = {} as Record<keyof E, Listener<E[keyof E]>[]>;
  }

  on<K extends keyof E, T>(event: K, listener: Listener<T>) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);

    return this;
  }

  off<K extends keyof E, T>(event: K, listener: Listener<T>) {
    if (!this.events[event]) return this;

    this.events[event] = this.events[event].filter((l) => l !== listener);
    if (this.events[event].length === 0) delete this.events[event];

    return this;
  }

  emit<K extends keyof E, D extends E[keyof E]>(event: K, data: D) {
    if (!this.events[event]) return;

    this.events[event].forEach((l) => l(data));
  }

  once<K extends keyof E, T>(event: K, listener: Listener<T>) {
    const onceListener = (data: T) => {
      listener(data);
      this.off(event, onceListener);
    };

    this.on(event, onceListener);
  }
}

export type EventList = {
  test: void;
  'todo-completed': { completed: boolean; id: number };
};

const eventEmitter = new EventEmitter<EventList>();

export const useEventEmitter = () => {
  const useSubscribe = <E extends keyof EventList>(
    event: E,
    listener: (data: EventList[E]) => void,
    once = false,
  ) => {
    useEffect(() => {
      if (once) eventEmitter.once(event, listener);
      else eventEmitter.on(event, listener);

      return () => {
        eventEmitter.off(event, listener);
      };
    }, [event, listener, once]);
  };

  return {
    emitter: eventEmitter,
    useSubscribe: useCallback(useSubscribe, []),
  };
};
