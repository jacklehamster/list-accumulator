import { IUpdateNotifier } from "./IUpdateNotifier";
import { List } from "abstract-list";

export interface IUpdatableList<T> extends List<T>, IUpdateNotifier {
}

export interface IPotentiallyUpdatableList<T> extends List<T>, Partial<IUpdateNotifier> {
}
