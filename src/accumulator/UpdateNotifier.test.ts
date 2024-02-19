import { UpdateNotifier } from "./UpdateNotifier";

describe("UpdateNotifier", () => {
  let updateNotifier: UpdateNotifier;

  beforeEach(() => {
    updateNotifier = new UpdateNotifier();
  });

  test("addUpdateListener adds a listener", () => {
    const listener = { onUpdate: jest.fn() };
    updateNotifier.addUpdateListener(listener);
    expect(updateNotifier.listeners.size).toBe(1);
  });

  test("removeUpdateListener removes a listener", () => {
    const listener = { onUpdate: jest.fn() };
    updateNotifier.addUpdateListener(listener);
    updateNotifier.removeUpdateListener(listener);
    expect(updateNotifier.listeners.size).toBe(0);
  });

  test("informUpdate calls onUpdate for each listener", () => {
    const listener1 = { onUpdate: jest.fn() };
    const listener2 = { onUpdate: jest.fn() };
    updateNotifier.addUpdateListener(listener1);
    updateNotifier.addUpdateListener(listener2);

    const id = 123;
    const type = 456;

    updateNotifier.informUpdate(id, type);

    expect(listener1.onUpdate).toHaveBeenCalledWith(id, type);
    expect(listener2.onUpdate).toHaveBeenCalledWith(id, type);
  });
});
