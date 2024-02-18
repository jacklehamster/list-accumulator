import { forEach } from "abstract-list";
import { IUpdatableList } from "./IUpdatableList";
import { FULL_UPDATE, UpdateType } from "dok-types";


export function informFullUpdate(elems: IUpdatableList<any>, type: UpdateType = FULL_UPDATE) {
  forEach(elems, (_, index) => elems.informUpdate(index, type));
}
