export class Collection<T> {
  _notify: (items: T[]) => void;

  constructor(private _items: T[] = []) {
    this._items = _items;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this._notify = () => {};
  }

  // SETTERS & GETTERS
  set items(items: T[]) {
    this._items = items;
  }
  get items() {
    return [...this._items];
  }

  set notify(notifier: (items: T[]) => void) {
    this._notify = notifier;
  }

  // CHECKERS
  hasItem(item: T) {
    return this._items.includes(item);
  }

  hasPartialItem(item: Partial<T>) {
    return this._items.some((i) => {
      for (const key in item) {
        if (i[key] === item[key]) return true;
      }
      return false;
    });
  }

  // ADDERS & REMOVERS
  append(...item: T[]) {
    this._items.push(...item);

    this._notify(this.items);
    return this;
  }

  prepend(...items: T[]) {
    this._items.unshift(...items);

    this._notify(this.items);
    return this;
  }

  insert(index: number, ...items: T[]) {
    this._items.splice(index, 0, ...items);

    this._notify(this.items);
    return this;
  }

  remove(...item: T[]) {
    this._items = this._items.filter((i) => !item.includes(i));

    this._notify(this.items);
    return this;
  }

  removePartial(item: Partial<T>) {
    this._items = this._items.filter((i) => {
      for (const key in item) {
        if (i[key] !== item[key]) return true;
      }
    });

    this._notify(this.items);
    return this;
  }
}
