import { IdType, UpdateType } from "dok-types";


export interface IUpdateListener {
  onUpdate(id: IdType, type?: UpdateType): void;
}
