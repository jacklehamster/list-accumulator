import { IdType, UpdateType } from "dok-types";
import { IUpdateListener } from "./IUpdateListener";
import { List, forEach } from "abstract-list";
import { EMPTY, SlotId } from "./Accumulator";
import { IPotentiallyUpdatableList } from "./IUpdatableList";


export class UpdateListener<T> implements IUpdateListener {
  readonly #indexToSlotIdMapping: (number | undefined)[] = [];
  readonly slotIdSet = new Set<SlotId>();

  constructor(private elems: IPotentiallyUpdatableList<T>,
    private informUpdate: (slotId: SlotId, type?: UpdateType) => void,
    private addElem: (elems: List<T>, index: number) => IdType,
    private removeElem: (slotId: IdType) => void) {
    this.elems = elems;
    this.initialize(elems);
  }

  initialize(elems: IPotentiallyUpdatableList<T>): void {
    this.elems = elems;
    this.elems.addUpdateListener?.(this);
    forEach(elems, (_, index) => this.onUpdate(index));
  }

  dispose(): void {
    forEach(this.elems, (_, index) => this.onUpdate(index));
    this.elems.removeUpdateListener?.(this);
    this.elems = EMPTY;
    this.#indexToSlotIdMapping.length = 0;
  }

  onUpdate(index: number, type?: number | undefined): void {
    const elem = this.elems.at(index);
    let slotId = this.#indexToSlotIdMapping[index];
    if (slotId === undefined) {
      if (!elem) {
        //  no update needed on non-existing item
        return;
      }
      //  create new entry
      const slotId = this.addElem(this.elems, index);
      this.#indexToSlotIdMapping[index] = slotId;
      this.slotIdSet.add(slotId);
      return;
    } else if (!elem) {
      //  remove entry
      this.removeElem(slotId);
      this.#indexToSlotIdMapping[index] = undefined;
      this.slotIdSet.delete(slotId);
      return;
    }

    //  Inform update
    this.informUpdate(slotId, type);
  }
}
