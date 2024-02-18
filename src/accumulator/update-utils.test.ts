import { FULL_UPDATE } from "dok-types";
import { IUpdatableList } from "./IUpdatableList";
import { informFullUpdate } from "./update-utils";

describe("informFullUpdate", () => {
  test("calls informUpdate for each element in the list", () => {
    const mockInformUpdate = jest.fn();
    const mockList: IUpdatableList<any> = {
      length: 3,
      informUpdate: mockInformUpdate,
      at() { return 0; },
      addUpdateListener() { },
      removeUpdateListener() { },
    };

    informFullUpdate(mockList);

    expect(mockInformUpdate).toHaveBeenCalledTimes(3);
    expect(mockInformUpdate).toHaveBeenCalledWith(0, FULL_UPDATE);
    expect(mockInformUpdate).toHaveBeenCalledWith(1, FULL_UPDATE);
    expect(mockInformUpdate).toHaveBeenCalledWith(2, FULL_UPDATE);
  });

  test("calls informUpdate with the specified type", () => {
    const mockInformUpdate = jest.fn();
    const mockList = {
      length: 2,
      informUpdate: mockInformUpdate,
      at() { return 0; },
      addUpdateListener() { },
      removeUpdateListener() { },
    };
    const updateType = 123;

    informFullUpdate(mockList, updateType);

    expect(mockInformUpdate).toHaveBeenCalledTimes(2);
    expect(mockInformUpdate).toHaveBeenCalledWith(0, updateType);
    expect(mockInformUpdate).toHaveBeenCalledWith(1, updateType);
  });
});
