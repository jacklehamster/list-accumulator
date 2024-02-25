// /Users/vincent/list-accumulator/example/node_modules/list-accumulator/dist/index.js
class W {
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
var R = function(D, J) {
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
    this.elems = D, this.elems.addUpdateListener?.(this), R(D, (J, K) => this.onUpdate(K));
  }
  dispose() {
    R(this.elems, (D, J) => this.onUpdate(J)), this.elems.removeUpdateListener?.(this), this.elems = G, this.#D.length = 0;
  }
  onUpdate(D, J) {
    const K = this.elems.at(D);
    let Q = this.#D[D];
    if (Q === undefined) {
      if (!K)
        return;
      const V = this.addElem(this.elems, D);
      this.#D[D] = V;
      return;
    } else if (!K) {
      this.removeElem(Q), this.#D[D] = undefined;
      return;
    }
    this.informUpdate(Q, J);
  }
}

class $ extends W {
  constructor({ informUpdate: D, addElem: J, removeElem: K }) {
    super((Q, V) => {
      if (Q)
        return Q.initialize(V), Q;
      return new Z(V, D, J, K);
    }, (Q) => {
      Q.dispose();
    });
  }
}

class B {
  #D = [];
  #J = [];
  length;
  constructor({ onChange: D } = {}) {
    this.length = { valueOf: () => this.#D.length, onChange: D ? (J) => D?.(J) : undefined };
  }
  at(D) {
    return this.#D.at(D);
  }
  addElem(D) {
    const J = this.#K();
    return this.#D[J] = D, J;
  }
  removeElem(D) {
    const J = this.#D.at(D);
    if (J !== undefined)
      this.#D[D] = undefined, this.#J.push(D);
    return J;
  }
  clear() {
    if (this.#D.length !== 0)
      this.#D.length = 0, this.#Q();
    this.#J.length = 0;
  }
  #K() {
    let D = this.#J.pop();
    if (D === undefined)
      D = this.#D.length, this.#D.push(undefined), this.#Q();
    return D;
  }
  #Q() {
    this.length.onChange?.(this.length.valueOf());
  }
}

class H extends X {
  #D;
  #J = new Map;
  #K = new O;
  #Q = new $({ informUpdate: this.informUpdate.bind(this), addElem: this.#R.bind(this), removeElem: this.#V.bind(this) });
  constructor({ onChange: D } = {}) {
    super();
    this.#D = new B({ onChange: D });
  }
  get length() {
    return this.#D.length;
  }
  at(D) {
    const J = this.#D.at(D);
    return J?.elems.at(J.index);
  }
  add(D) {
    const J = this.#Q.create(D);
    this.#J.set(D, J);
  }
  remove(D) {
    const J = this.#J.get(D);
    if (J)
      this.#J.delete(D), this.#Q.recycle(J);
  }
  clear() {
    R(this.#D, (D, J) => {
      if (this.informUpdate(J), D)
        this.#K.recycle(D);
    }), this.#D.clear();
  }
  updateFully(D) {
    for (let [J, K] of this.#J)
      R(J, (Q, V) => K.onUpdate(V, D));
  }
  #R(D, J) {
    const K = this.#D.addElem(this.#K.create(D, J));
    return this.informUpdate(K), K;
  }
  #V(D) {
    const J = this.#D.removeElem(D);
    if (J)
      this.#K.recycle(J), this.informUpdate(D);
  }
}
var G = [];

class O extends W {
  constructor() {
    super((D, J, K) => {
      if (!D)
        return { elems: J, index: K };
      return D.elems = J, D.index = K, D;
    }, (D) => {
      D.elems = G;
    });
  }
}

class _ {
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
  H as Accumulator
};
