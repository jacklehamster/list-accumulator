import { IdType, UpdateType } from "dok-types";
import { ObjectPool } from "bun-pool";
import { UpdateNotifier } from "./UpdateNotifier";
import { List, forEach } from "abstract-list";
import { UpdateListenerPool } from "./UpdateListenerPool";
import { UpdateListener } from "./UpdateListener";
import { IPotentiallyUpdatableList, IUpdatableList } from "./IUpdatableList";
import { SwissCheeseList } from "./SwissCheeseList";

interface Slot<T> {
  elems: List<T>;
  index: IdType;
}

interface Props<T> {
  onChange(value: number): void;
  elems: IPotentiallyUpdatableList<T>[];
}

export type SlotId = IdType;

export class Accumulator<T> extends UpdateNotifier implements IUpdatableList<T> {
  readonly #slots;
  readonly #updateListenerMap: Map<List<T>, UpdateListener<T>> = new Map();
  readonly #slotPool = new SlotPool<T>();
  readonly #listenerPool = new UpdateListenerPool<T>({
    informUpdate: this.informUpdate.bind(this),
    addElem: this.#addElemToSlot.bind(this),
    removeElem: this.#removeElemFromSlot.bind(this),
  });

  constructor({ onChange, elems }: Partial<Props<T>> = {}) {
    super();
    this.#slots = new SwissCheeseList<Slot<T>>({ onChange });
    elems?.forEach(list => this.add(list));
  }

  get length(): List<T>["length"] {
    return this.#slots.length;
  }

  at(slotId: SlotId): T | undefined {
    const slot = this.#slots.at(slotId);
    return slot?.elems.at(slot.index);
  }

  add(elems: IPotentiallyUpdatableList<T>): void {
    const updateListener = this.#listenerPool.create(elems);
    this.#updateListenerMap.set(elems, updateListener);
  }

  remove(elems: IPotentiallyUpdatableList<T>): void {
    const listener = this.#updateListenerMap.get(elems);
    if (listener) {
      for (const slotId of listener.slotIdSet) {
        if (slotId) {
          this.#removeElemFromSlot(slotId);
        }
      }
      this.#updateListenerMap.delete(elems);
      this.#listenerPool.recycle(listener);
    }
  }

  clear(): void {
    forEach(this.#slots, (slot, slotId) => {
      this.informUpdate(slotId);
      if (slot) {
        this.#slotPool.recycle(slot);
      }
    });
    this.#slots.clear();
  }

  updateFully(type?: UpdateType): void {
    for (const [elems, listener] of this.#updateListenerMap) {
      forEach(elems, (_, index) => listener.onUpdate(index, type));
    }
  }

  #addElemToSlot(elems: List<T>, index: number): SlotId {
    const slotId = this.#slots.addElem(this.#slotPool.create(elems, index));
    this.informUpdate(slotId);
    return slotId;
  }

  #removeElemFromSlot(slotId: SlotId): void {
    const slot = this.#slots.removeElem(slotId);
    if (slot) {
      this.#slotPool.recycle(slot);
      this.informUpdate(slotId);
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
