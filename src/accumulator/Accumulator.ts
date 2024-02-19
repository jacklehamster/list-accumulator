import { IdType } from "dok-types";
import { ObjectPool } from "bun-pool";
import { IUpdateNotifier } from "./IUpdateNotifier";
import { UpdateNotifier } from "./UpdateNotifier";
import { List, forEach } from "abstract-list";
import { UpdateListenerPool } from "./UpdateListenerPool";
import { UpdateListener } from "./UpdateListener";
import { IUpdatableList } from "./IUpdatableList";
import { SwissCheeseList } from "./SwissCheeseList";

interface Slot<T> {
  elems: List<T>;
  index: IdType;
}

interface Props {
  onChange(value: number): void;
}

export class Accumulator<T> extends UpdateNotifier implements IUpdatableList<T> {
  readonly #slots;
  readonly #updateListenerMap: Map<List<T>, UpdateListener<T>> = new Map();
  readonly #slotPool = new SlotPool<T>();
  readonly #listenerPool = new UpdateListenerPool<T>({
    informUpdate: this.informUpdate.bind(this),
    addElem: this.#addElemToSlot.bind(this),
    removeElem: this.#removeElemFromSlot.bind(this),
  });

  constructor({ onChange }: Partial<Props> = {}) {
    super();
    this.#slots = new SwissCheeseList<Slot<T>>({ onChange });
  }

  get length(): List<T>["length"] {
    return this.#slots.length;
  }

  at(id: IdType): T | undefined {
    const slot = this.#slots.at(id);
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
    forEach(this.#slots, (slot, id) => {
      this.informUpdate(id);
      if (slot) {
        this.#slotPool.recycle(slot);
      }
    });
    this.#slots.clear();
  }

  #addElemToSlot(elems: List<T>, index: number): IdType {
    const id = this.#slots.addElem(this.#slotPool.create(elems, index));
    this.informUpdate(id);
    return id;
  }

  #removeElemFromSlot(id: IdType): void {
    const slot = this.#slots.removeElem(id);
    if (slot) {
      this.#slotPool.recycle(slot);
      this.informUpdate(id);
    }
  }
}

export const EMPTY: List<any> = []

class SlotPool<T> extends ObjectPool<Slot<T>, [List<T>, IdType]> {
  constructor() {
    super((slot, elems, index) => {
      if (!slot) {
        return { elems, index };
      }
      slot.elems = elems;
      slot.index = index;
      return slot;
    }, slot => {
      slot.elems = EMPTY;
    });
  }
}
