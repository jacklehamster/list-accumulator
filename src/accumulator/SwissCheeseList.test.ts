import { SwissCheeseList } from "./SwissCheeseList";

describe("SwissCheeseList", () => {
  let list: SwissCheeseList<string>;
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
    list = new SwissCheeseList({ onChange });
  });

  test("add and remove items", () => {
    list.addElem("test0");
    list.addElem("test1");
    list.addElem("test2");
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(list.at(1)).toEqual("test1");
    expect(list.removeElem(1)).toEqual("test1");
    expect(list.length.valueOf()).toEqual(3);
    expect(list.addElem("newElem")).toEqual(1);
    expect(list.length.valueOf()).toEqual(3);
  });
});
