import { IdType } from "dok-types";
import { ObjectPool } from "bun-pool";
import { IUpdateNotifier } from "./IUpdateNotifier";
import { UpdateNotifier } from "./UpdateNotifier";
import { List } from "abstract-list";
import { UpdateListenerPool } from "./UpdateListenerPool";
import { UpdateListener } from "./UpdateListener";
import { IUpdatableList } from "./IUpdatableList";

interface Slot<T> {
  elems: List<T>;
  index: IdType;
}

interface Props {
  onChange?(value: number): void;
}

export class Accumulator<T> extends UpdateNotifier implements IUpdatableList<T> {
  readonly #slots: (Slot<T> | undefined)[] = [];
  readonly #pool = new SlotPool<T>();
  readonly #freeIndices: number[] = [];
  readonly #updateListenerMap: Map<List<T>, UpdateListener<T>> = new Map();
  readonly #listenerPool = new UpdateListenerPool<T>({
    informUpdate: this.informUpdate.bind(this),
    addElem: this.#addElemToSlot.bind(this),
    removeElem: this.#removeElemFromSlot.bind(this),
  });
  readonly length: List<T>["length"];

  constructor({ onChange }: Partial<Props> = {}) {
    super();
    this.length = {
      valueOf: () => this.#slots.length,
      onChange: onChange ? (value) => onChange?.(value) : undefined,
    };
  }

  at(id: IdType): T | undefined {
    const slot = this.#slots[id];
    return slot?.elems.at(slot.index);
  }

  add(elems: List<T> & Partial<IUpdateNotifier>): void {
    const updateListener = this.#listenerPool.create(elems);
    this.#updateListenerMap.set(elems, updateListener);
  }

  remove(elems: List<T> & Partial<IUpdateNotifier>): void {
    const listener = this.#updateListenerMap.get(elems);
    if (listener) {
      this.#updateListenerMap.delete(elems);
      this.#listenerPool.recycle(listener);
    }
  }

  clear(): void {
    this.#slots.forEach((slot, id) => {
      this.informUpdate(id);
      if (slot) {
        this.#pool.recycle(slot);
      }
    });
    this.#freeIndices.length = 0;
    this.#slots.length = 0;
    this.#onSizeChange();
  }

  #onSizeChange() {
    this.length.onChange?.(this.length.valueOf());
  }

  #provideIndex(): number {
    let freeIndex = this.#freeIndices.pop();
    if (freeIndex === undefined) {
      freeIndex = this.#slots.length;
      this.#slots.push(undefined);
      this.#onSizeChange();
    }
    return freeIndex;
  }

  #recycleIndex(index: number): void {
    this.#freeIndices.push(index);
  }

  #addElemToSlot(elems: List<T>, index: number): IdType {
    const id = this.#provideIndex();
    this.#slots[id] = this.#pool.create(elems, index, id);
    this.informUpdate(id);
    return id;
  }

  #removeElemFromSlot(id: IdType): void {
    const slot = this.#slots[id];
    if (slot) {
      this.#pool.recycle(slot);
      this.#slots[id] = undefined;
    }
    this.#recycleIndex(id);
    this.informUpdate(id);
  }
}

export const EMPTY: List<any> = []

class SlotPool<T> extends ObjectPool<Slot<T>, [List<T>, IdType, IdType]> {
  constructor() {
    super((slot, elems, index) => {
      if (!slot) {
        return { elems, index };
      }
      slot.elems = elems;
      slot.index = index;
      return slot;
    });
  }
}
