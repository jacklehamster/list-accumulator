// /Users/vincent/list-accumulator/example/node_modules/list-accumulator/dist/index.js
class R {
  i;
  f;
  warningLimit = 50000;
  #D = new Set;
  #J = [];
  constructor(D, J) {
    this.initCall = D, this.onRecycle = J;
  }
  create(...D) {
    const J = this.#J.pop();
    if (J)
      return this.#D.add(J), this.initCall(J, ...D);
    const K = this.initCall(undefined, ...D);
    return this.#D.add(K), this.#Q(), K;
  }
  recycle(D) {
    this.#D.delete(D), this.#K(D);
  }
  recycleAll() {
    for (let D of this.#D)
      this.#K(D);
    this.#D.clear();
  }
  clear() {
    this.#J.length = 0, this.#D.clear();
  }
  countObjectsInExistence() {
    return this.#D.size + this.#J.length;
  }
  #K(D) {
    this.#J.push(D), this.onRecycle?.(D);
  }
  #Q() {
    if (this.countObjectsInExistence() === this.warningLimit)
      console.warn("ObjectPool already created", this.#D.size + this.#J.length, "in", this.constructor.name);
  }
}

class X {
  listeners = new Set;
  informUpdate(D, J) {
    this.listeners.forEach((K) => K.onUpdate(D, J));
  }
  addUpdateListener(D) {
    this.listeners.add(D);
  }
  removeUpdateListener(D) {
    this.listeners.delete(D);
  }
}
var V = function(D, J) {
  if (D) {
    const K = D.length.valueOf();
    for (let Q = 0;Q < K; Q++)
      J(D.at(Q), Q);
  }
};

class Z {
  D;
  J;
  K;
  Q;
  #D = [];
  constructor(D, J, K, Q) {
    this.elems = D;
    this.informUpdate = J;
    this.addElem = K;
    this.removeElem = Q;
    this.elems = D, this.initialize(D);
  }
  initialize(D) {
    this.elems = D, this.elems.addUpdateListener?.(this), V(D, (J, K) => this.onUpdate(K));
  }
  dispose() {
    V(this.elems, (D, J) => this.onUpdate(J)), this.elems.removeUpdateListener?.(this), this.elems = $;
  }
  onUpdate(D, J) {
    const K = this.elems.at(D);
    let Q = this.#D[D];
    if (Q === undefined) {
      if (!K)
        return;
      const W = this.addElem(this.elems, D);
      this.#D[D] = W;
      return;
    } else if (!K) {
      this.removeElem(Q), this.#D[D] = undefined;
      return;
    }
    this.informUpdate(Q, J);
  }
}

class _ extends R {
  constructor({ informUpdate: D, addElem: J, removeElem: K }) {
    super((Q, W) => {
      if (Q)
        return Q.initialize(W), Q;
      return new Z(W, D, J, K);
    }, (Q) => {
      Q.dispose();
    });
  }
}

class w extends X {
  #D = [];
  #J = new B;
  #K = [];
  #Q = new Map;
  #R = new _({ informUpdate: this.informUpdate.bind(this), addElem: this.#Z.bind(this), removeElem: this.#_.bind(this) });
  length;
  constructor({ onChange: D } = {}) {
    super();
    this.length = { valueOf: () => this.#D.length, onChange: D ? (J) => D?.(J) : undefined };
  }
  at(D) {
    const J = this.#D[D];
    return J?.elems.at(J.index);
  }
  add(D) {
    const J = this.#R.create(D);
    this.#Q.set(D, J);
  }
  remove(D) {
    const J = this.#Q.get(D);
    if (J)
      this.#Q.delete(D), this.#R.recycle(J);
  }
  clear() {
    this.#D.forEach((D, J) => {
      if (this.informUpdate(J), D)
        this.#J.recycle(D);
    }), this.#K.length = 0, this.#D.length = 0, this.#V();
  }
  #V() {
    this.length.onChange?.(this.length.valueOf());
  }
  #W() {
    let D = this.#K.pop();
    if (D === undefined)
      D = this.#D.length, this.#D.push(undefined), this.#V();
    return D;
  }
  #X(D) {
    this.#K.push(D);
  }
  #Z(D, J) {
    const K = this.#W();
    return this.#D[K] = this.#J.create(D, J, K), this.informUpdate(K), K;
  }
  #_(D) {
    const J = this.#D[D];
    if (J)
      this.#J.recycle(J), this.#D[D] = undefined;
    this.#X(D), this.informUpdate(D);
  }
}
var $ = [];

class B extends R {
  constructor() {
    super((D, J, K) => {
      if (!D)
        return { elems: J, index: K };
      return D.elems = J, D.index = K, D;
    });
  }
}

class H {
  i;
  f;
  warningLimit = 50000;
  #D = new Set;
  #J = [];
  constructor(D, J) {
    this.initCall = D, this.onRecycle = J;
  }
  create(...D) {
    const J = this.#J.pop();
    if (J)
      return this.#D.add(J), this.initCall(J, ...D);
    const K = this.initCall(undefined, ...D);
    return this.#D.add(K), this.#Q(), K;
  }
  recycle(D) {
    this.#D.delete(D), this.#K(D);
  }
  recycleAll() {
    for (let D of this.#D)
      this.#K(D);
    this.#D.clear();
  }
  clear() {
    this.#J.length = 0, this.#D.clear();
  }
  countObjectsInExistence() {
    return this.#D.size + this.#J.length;
  }
  #K(D) {
    this.#J.push(D), this.onRecycle?.(D);
  }
  #Q() {
    if (this.countObjectsInExistence() === this.warningLimit)
      console.warn("ObjectPool already created", this.#D.size + this.#J.length, "in", this.constructor.name);
  }
}
export {
  w as Accumulator
};
