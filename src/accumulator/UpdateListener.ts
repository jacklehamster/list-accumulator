import { IdType, UpdateType } from "dok-types";
import { IUpdateListener } from "./IUpdateListener";
import { List, forEach } from "abstract-list";
import { EMPTY } from "./Accumulator";
import { IPotentiallyUpdatableList } from "./IUpdatableList";


export class UpdateListener<T> implements IUpdateListener {
  readonly #indexMapping: (number | undefined)[] = [];
  readonly #idSet = new Set<IdType>();

  constructor(private elems: IPotentiallyUpdatableList<T>,
    private informUpdate: (id: IdType, type?: UpdateType) => void,
    private addElem: (elems: List<T>, index: number) => IdType,
    private removeElem: (id: IdType) => void) {
    this.elems = elems;
    this.initialize(elems);
  }

  initialize(elems: IPotentiallyUpdatableList<T>): void {
    this.elems = elems;
    this.elems.addUpdateListener?.(this);
    forEach(elems, (_: any, index: number) => this.onUpdate(index));
  }

  dispose(): void {
    this.#idSet.forEach(id => this.removeElem(id));
    this.elems.removeUpdateListener?.(this);
    this.elems = EMPTY;
    this.#indexMapping.length = 0;
    this.#idSet.clear();
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
      this.#idSet.add(id);
      return;
    } else if (!elem) {
      //  remove entry
      this.#idSet.delete(id);
      this.removeElem(id);
      this.#indexMapping[index] = undefined;
      return;
    }

    //  Inform update
    this.informUpdate(id, type);
  }
}
