export type Listener = () => void;
export class Subscription<TListener extends Listener = Listener> {
  protected listeners: TListener[];

  constructor() {
    this.listeners = [];
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener: TListener) {
    this.listeners.push(listener);

    this.onSubscribe();

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  hasListener(listener: TListener) {
    return this.listeners.includes(listener);
  }

  hasListeners() {
    return this.listeners.length > 0;
  }

  protected onSubscribe() {
    // do something
  }

  protected onUnsubscribe() {
    // do something
  }
}
