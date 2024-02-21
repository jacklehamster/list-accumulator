import { IdType, UpdateType } from "dok-types";
import { ObjectPool } from "bun-pool";
import { List } from "abstract-list";
import { UpdateListener } from "./UpdateListener";
import { IPotentiallyUpdatableList } from "./IUpdatableList";

export class UpdateListenerPool<T> extends ObjectPool<UpdateListener<T>, [IPotentiallyUpdatableList<T>]> {
  constructor({ informUpdate, addElem, removeElem }: {
    informUpdate: (id: IdType, type?: UpdateType) => void;
    addElem: (elems: List<T>, index: number) => IdType;
    removeElem: (id: IdType) => void;
  }) {
    super((listener, elems) => {
      if (listener) {
        listener.initialize(elems);
        return listener;
      }
      return new UpdateListener(elems, informUpdate, addElem, removeElem);
    }, listener => {
      listener.dispose();
    });
  }
}
