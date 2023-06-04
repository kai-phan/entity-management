import React from 'react';

export type SelectFunction<T> = (
  item: T,
) => T extends string | number
  ? T
  : keyof T extends string | number
  ? T[keyof T]
  : never;

export class Selection<T> {
  private _selectedKeys: ReturnType<SelectFunction<T>>[] = [];
  private _notify: (selectedKeys: ReturnType<SelectFunction<T>>[]) => void;
  constructor(
    protected _items: T[],
    private selectFunction: SelectFunction<T>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this._notify = () => {};
  }

  // SETTERS & GETTERS
  set items(items: T[]) {
    this._items = items;
  }

  set selectedKeys(keys: ReturnType<SelectFunction<T>>[]) {
    this._selectedKeys = keys;
  }
  get selectedKeys() {
    return [...this._selectedKeys];
  }

  get selectedItems() {
    return this._items.filter((item) =>
      this._selectedKeys.includes(this.selectFunction(item)),
    );
  }

  set notify(
    notifier: (selectedKeys: ReturnType<SelectFunction<T>>[]) => void,
  ) {
    this._notify = notifier;
  }

  // CHECKERS
  hasItem(item: T) {
    return this._items.includes(item);
  }

  hasKey(key: ReturnType<SelectFunction<T>>) {
    return this._items.some((item) => this.selectFunction(item) === key);
  }

  hasPartialItem(item: Partial<T>) {
    return this._items.some((i) => {
      for (const key in item) {
        if (i[key] === item[key]) return true;
      }
      return false;
    });
  }

  isItemSelected(item: T) {
    return this._selectedKeys.includes(this.selectFunction(item));
  }

  isKeySelected(key: ReturnType<SelectFunction<T>>) {
    return this._selectedKeys.includes(key);
  }

  isPartialItemSelected(item: Partial<T>) {
    return this._selectedKeys.some((key) => {
      for (const k in item) {
        if (item[k] === key) return true;
      }
      return false;
    });
  }

  getPartialItem(item: Partial<T>) {
    return this._items.find((i) => {
      for (const key in item) {
        if (i[key] !== item[key]) return false;
      }
      return true;
    });
  }

  // SELECTORS
  selectItem(item: T) {
    if (this.hasItem(item)) {
      const key = this.selectFunction(item);
      if (!this.isKeySelected(key)) {
        this._selectedKeys.push(key);
      }
    }

    this._notify(this.selectedKeys);

    return this;
  }

  selectKey(key: ReturnType<SelectFunction<T>>) {
    if (this.hasKey(key) && !this.isKeySelected(key)) {
      this._selectedKeys.push(key);
    }

    this._notify(this.selectedKeys);

    return this;
  }

  selectPartialItem(item: Partial<T>) {
    if (this.hasPartialItem(item) && !this.isPartialItemSelected(item)) {
      const partialItem = this.getPartialItem(item as T);
      if (partialItem) {
        this.selectItem(partialItem);
      }
    }
    this._notify(this.selectedKeys);

    return this;
  }

  unselectItem(item: T) {
    if (this.hasItem(item) && this.isItemSelected(item)) {
      const key = this.selectFunction(item);
      this._selectedKeys = this._selectedKeys.filter((k) => k !== key);
    }

    this._notify(this.selectedKeys);

    return this;
  }

  unselectKey(key: ReturnType<SelectFunction<T>>) {
    if (this.hasKey(key) && this.isKeySelected(key)) {
      this._selectedKeys = this._selectedKeys.filter((k) => k !== key);
    }

    this._notify(this.selectedKeys);

    return this;
  }

  unselectPartialItem(item: Partial<T>) {
    if (this.hasPartialItem(item) && this.isPartialItemSelected(item)) {
      const partialItem = this.getPartialItem(item as T);
      if (partialItem) {
        this.unselectItem(partialItem);
      }
    }

    this._notify(this.selectedKeys);

    return this;
  }

  toggleItem(item: T) {
    if (this.isItemSelected(item)) {
      this.unselectItem(item);
    } else {
      this.selectItem(item);
    }

    this._notify(this.selectedKeys);

    return this;
  }

  toggleKey(key: ReturnType<SelectFunction<T>>) {
    if (this.isKeySelected(key)) {
      this.unselectKey(key);
    } else {
      this.selectKey(key);
    }

    this._notify(this.selectedKeys);

    return this;
  }

  togglePartialItem(item: Partial<T>) {
    if (this.isPartialItemSelected(item)) {
      this.unselectPartialItem(item);
    } else {
      this.selectPartialItem(item);
    }

    this._notify(this.selectedKeys);

    return this;
  }

  // MULTI SELECT

  isAllSelected() {
    return this._items.every((item) => this.isItemSelected(item));
  }

  isNoneSelected() {
    return this._items.every((item) => !this.isItemSelected(item));
  }

  selectAll() {
    this._selectedKeys = this._items.map((item) => this.selectFunction(item));
    this._notify(this.selectedKeys);

    return this;
  }

  unselectAll() {
    this._selectedKeys = [];
    this._notify(this.selectedKeys);

    return this;
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.unselectAll();
    } else {
      this.selectAll();
    }

    this._notify(this.selectedKeys);

    return this;
  }
}

export const useSelection = <T>(
  items: T[],
  selectFunction: SelectFunction<T>,
  defaultSelectedKeys: ReturnType<SelectFunction<T>>[] = [],
) => {
  const selectionRef = React.useRef(new Selection(items, selectFunction));
  const selection = selectionRef.current;

  const [selectedKeys, setSelectedKeys] = React.useState(
    defaultSelectedKeys || (() => selection.selectedKeys),
  );

  selection.items = items;
  selection.selectedKeys = selectedKeys;
  selection.notify = setSelectedKeys;

  return {
    selectedKeys,
    selection,
  } as const;
};
