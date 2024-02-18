// /Users/vincent/list-accumulator/example/node_modules/list-accumulator/dist/index.js
class Q {
  i;
  f;
  warningLimit = 50000;
  #w = new Set;
  #D = [];
  constructor(w, D) {
    this.initCall = w, this.onRecycle = D;
  }
  create(...w) {
    const D = this.#D.pop();
    if (D)
      return this.#w.add(D), this.initCall(D, ...w);
    const J = this.initCall(undefined, ...w);
    return this.#w.add(J), this.#K(), J;
  }
  recycle(w) {
    this.#w.delete(w), this.#J(w);
  }
  recycleAll() {
    for (let w of this.#w)
      this.#J(w);
    this.#w.clear();
  }
  clear() {
    this.#D.length = 0, this.#w.clear();
  }
  countObjectsInExistence() {
    return this.#w.size + this.#D.length;
  }
  #J(w) {
    this.#D.push(w), this.onRecycle?.(w);
  }
  #K() {
    if (this.countObjectsInExistence() === this.warningLimit)
      console.warn("ObjectPool already created", this.#w.size + this.#D.length, "in", this.constructor.name);
  }
}

class W {
  listeners = new Set;
  informUpdate(w, D) {
    this.listeners.forEach((J) => J.onUpdate(w, D));
  }
  addUpdateListener(w) {
    this.listeners.add(w);
  }
  removeUpdateListener(w) {
    this.listeners.delete(w);
  }
}
var R = function(w, D) {
  if (w) {
    const J = w.length.valueOf();
    for (let K = 0;K < J; K++)
      D(w.at(K), K);
  }
};

class X {
  w;
  D;
  J;
  K;
  #w = [];
  constructor(w, D, J, K) {
    this.elems = w;
    this.informUpdate = D;
    this.addElem = J;
    this.removeElem = K;
    this.elems = w, this.initialize(w);
  }
  initialize(w) {
    this.elems = w, this.elems.addUpdateListener?.(this), R(w, (D, J) => this.onUpdate(J));
  }
  dispose() {
    R(this.elems, (w, D) => this.onUpdate(D)), this.elems.removeUpdateListener?.(this), this.elems = $;
  }
  onUpdate(w, D) {
    const J = this.elems.at(w);
    let K = this.#w[w];
    if (K === undefined) {
      if (!J)
        return;
      const V = this.addElem(this.elems, w);
      this.#w[w] = V;
      return;
    } else if (!J) {
      this.removeElem(K), this.#w[w] = undefined;
      return;
    }
    this.informUpdate(K, D);
  }
}

class Z extends Q {
  constructor({ informUpdate: w, addElem: D, removeElem: J }) {
    super((K, V) => {
      if (K)
        return K.initialize(V), K;
      return new X(V, w, D, J);
    }, (K) => {
      K.dispose();
    });
  }
}

class B extends W {
  #w = [];
  #D = new G;
  #J = [];
  #K = new Map;
  #Q = new Z({ informUpdate: this.informUpdate.bind(this), addElem: this.#X.bind(this), removeElem: this.#Z.bind(this) });
  length;
  constructor({ onChange: w } = {}) {
    super();
    this.length = { valueOf: () => this.#w.length, onChange: w ? (D) => w?.(D) : undefined };
  }
  at(w) {
    const D = this.#w[w];
    return D?.elems.at(D.index);
  }
  add(w) {
    const D = this.#Q.create(w);
    this.#K.set(w, D);
  }
  remove(w) {
    const D = this.#K.get(w);
    if (D)
      this.#K.delete(w), this.#Q.recycle(D);
  }
  clear() {
    this.#w.forEach((w, D) => {
      if (this.informUpdate(D), w)
        this.#D.recycle(w);
    }), this.#J.length = 0, this.#w.length = 0, this.#R();
  }
  #R() {
    this.length.onChange?.(this.length.valueOf());
  }
  #V() {
    let w = this.#J.pop();
    if (w === undefined)
      w = this.#w.length, this.#w.push(undefined), this.#R();
    return w;
  }
  #W(w) {
    this.#J.push(w);
  }
  #X(w, D) {
    const J = this.#V();
    return this.#w[J] = this.#D.create(w, D, J), this.informUpdate(J), J;
  }
  #Z(w) {
    const D = this.#w[w];
    if (D)
      this.#D.recycle(D), this.#w[w] = undefined;
    this.#W(w), this.informUpdate(w);
  }
}
var $ = [];

class G extends Q {
  constructor() {
    super((w, D, J) => {
      if (!w)
        return { elems: D, index: J };
      return w.elems = D, w.index = J, w;
    });
  }
}

class Y {
  i;
  f;
  warningLimit = 50000;
  #w = new Set;
  #D = [];
  constructor(w, D) {
    this.initCall = w, this.onRecycle = D;
  }
  create(...w) {
    const D = this.#D.pop();
    if (D)
      return this.#w.add(D), this.initCall(D, ...w);
    const J = this.initCall(undefined, ...w);
    return this.#w.add(J), this.#K(), J;
  }
  recycle(w) {
    this.#w.delete(w), this.#J(w);
  }
  recycleAll() {
    for (let w of this.#w)
      this.#J(w);
    this.#w.clear();
  }
  clear() {
    this.#D.length = 0, this.#w.clear();
  }
  countObjectsInExistence() {
    return this.#w.size + this.#D.length;
  }
  #J(w) {
    this.#D.push(w), this.onRecycle?.(w);
  }
  #K() {
    if (this.countObjectsInExistence() === this.warningLimit)
      console.warn("ObjectPool already created", this.#w.size + this.#D.length, "in", this.constructor.name);
  }
}
export {
  B as Accumulator
};
