import { List } from "abstract-list";

interface Props {
  onChange(value: number): void;
}

export class SwissCheeseList<T> implements List<T> {
  readonly #elems: (T | undefined)[] = [];
  readonly #freeIndices: number[] = [];
  readonly length: List<T>["length"];

  constructor({ onChange }: Partial<Props> = {}) {
    this.length = {
      valueOf: () => this.#elems.length,
      onChange: onChange ? (value) => onChange?.(value) : undefined,
    };
  }

  at(index: number): T | undefined {
    return this.#elems.at(index);
  }

  addElem(elem: T): number {
    const index = this.#provideIndex();
    this.#elems[index] = elem;
    return index;
  }

  removeElem(index: number): T | undefined {
    const removedElem = this.#elems.at(index);
    if (removedElem !== undefined) {
      this.#elems[index] = undefined;
      this.#freeIndices.push(index);
    }
    return removedElem;
  }

  clear() {
    if (this.#elems.length !== 0) {
      this.#elems.length = 0;
      this.#onSizeChange();
    }
    this.#freeIndices.length = 0;
  }

  #provideIndex(): number {
    let freeIndex = this.#freeIndices.pop();
    if (freeIndex === undefined) {
      freeIndex = this.#elems.length;
      this.#elems.push(undefined);
      this.#onSizeChange();
    }
    return freeIndex;
  }

  #onSizeChange() {
    this.length.onChange?.(this.length.valueOf());
  }
}
