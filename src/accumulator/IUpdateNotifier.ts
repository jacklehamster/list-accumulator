import { IdType, UpdateType } from "dok-types";
import { IUpdateListener } from "./IUpdateListener";

export interface IUpdateNotifier {
  informUpdate(id: IdType, type?: UpdateType): void;
  addUpdateListener(listener: IUpdateListener): void;
  removeUpdateListener(listener: IUpdateListener): void;
}
