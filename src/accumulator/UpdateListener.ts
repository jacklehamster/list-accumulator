import { IdType, UpdateType } from "dok-types";
import { IUpdateListener, IUpdateNotifier } from "./IUpdateNotifier";
import { List, forEach } from "abstract-list";
import { EMPTY } from "./Accumulator";


export class UpdateListener<T> implements IUpdateListener {
  #indexMapping: (number | undefined)[] = [];

  constructor(private elems: List<T> & Partial<IUpdateNotifier>,
    private informUpdate: (id: IdType, type?: UpdateType) => void,
    private addElem: (elems: List<T>, index: number) => IdType,
    private removeElem: (id: IdType) => void) {
    this.elems = elems;
    this.initialize(elems);
  }

  initialize(elems: List<T> & Partial<IUpdateNotifier>): void {
    this.elems = elems;
    this.elems.addUpdateListener?.(this);
    forEach(elems, (_, index) => this.onUpdate(index));
  }

  dispose(): void {
    forEach(this.elems, (_, index) => this.onUpdate(index));
    this.elems.removeUpdateListener?.(this);
    this.elems = EMPTY;
  }

  onUpdate(index: number, type?: number | undefined): void {
    const elem = this.elems.at(index);
    let id = this.#indexMapping[index];
    if (id === undefined) {
      if (!elem) {
        //  no update needed on non-existing item
        return;
      }
      //  create new entry
      const id = this.addElem(this.elems, index);
      this.#indexMapping[index] = id;
      return;
    } else if (!elem) {
      //  remove entry
      this.removeElem(id);
      this.#indexMapping[index] = undefined;
      return;
    }

    //  Inform update
    this.informUpdate(id, type);
  }
}
