// /Users/vincent/list-accumulator/example/node_modules/list-accumulator/dist/index.js
class a {
  i;
  f;
  warningLimit = 50000;
  #t = new Set;
  #e = [];
  constructor(t, e) {
    this.initCall = t, this.onRecycle = e;
  }
  create(...t) {
    const e = this.#e.pop();
    if (e)
      return this.#t.add(e), this.initCall(e, ...t);
    const r = this.initCall(undefined, ...t);
    return this.#t.add(r), this.#o(), r;
  }
  recycle(t) {
    this.#t.delete(t), this.#r(t);
  }
  recycleAll() {
    for (let t of this.#t)
      this.#r(t);
    this.#t.clear();
  }
  clear() {
    this.#e.length = 0, this.#t.clear();
  }
  countObjectsInExistence() {
    return this.#t.size + this.#e.length;
  }
  #r(t) {
    this.#e.push(t), this.onRecycle?.(t);
  }
  #o() {
    if (this.countObjectsInExistence() === this.warningLimit)
      console.warn("ObjectPool already created", this.#t.size + this.#e.length, "in", this.constructor.name);
  }
}

class d {
  listeners = new Set;
  informUpdate(t, e) {
    this.listeners.forEach((r) => r.onUpdate(t, e));
  }
  addUpdateListener(t) {
    this.listeners.add(t);
  }
  removeUpdateListener(t) {
    this.listeners.delete(t);
  }
}
var i = function(t, e) {
  if (t) {
    const r = t.length.valueOf();
    for (let o = 0;o < r; o++)
      e(t.at(o), o);
  }
};

class n {
  t;
  e;
  r;
  o;
  #t = [];
  #e = new Set;
  constructor(t, e, r, o) {
    this.elems = t;
    this.informUpdate = e;
    this.addElem = r;
    this.removeElem = o;
    this.elems = t, this.initialize(t);
  }
  initialize(t) {
    this.elems = t, this.elems.addUpdateListener?.(this), i(t, (e, r) => this.onUpdate(r));
  }
  dispose() {
    this.#e.forEach((t) => this.removeElem(t)), this.elems.removeUpdateListener?.(this), this.elems = m, this.#t.length = 0, this.#e.clear();
  }
  onUpdate(t, e) {
    const r = this.elems.at(t);
    let o = this.#t[t];
    if (o === undefined) {
      if (!r)
        return;
      const s = this.addElem(this.elems, t);
      this.#t[t] = s, this.#e.add(s);
      return;
    } else if (!r) {
      this.#e.delete(o), this.removeElem(o), this.#t[t] = undefined;
      return;
    }
    this.informUpdate(o, e);
  }
}

class l extends a {
  constructor({ informUpdate: t, addElem: e, removeElem: r }) {
    super((o, s) => {
      if (o)
        return o.initialize(s), o;
      return new n(s, t, e, r);
    }, (o) => {
      o.dispose();
    });
  }
}

class p {
  #t = [];
  #e = [];
  length;
  constructor({ onChange: t } = {}) {
    this.length = { valueOf: () => this.#t.length, onChange: t ? (e) => t?.(e) : undefined };
  }
  at(t) {
    return this.#t.at(t);
  }
  addElem(t) {
    const e = this.#r();
    return this.#t[e] = t, e;
  }
  removeElem(t) {
    const e = this.#t.at(t);
    if (e !== undefined)
      this.#t[t] = undefined, this.#e.push(t);
    return e;
  }
  clear() {
    if (this.#t.length !== 0)
      this.#t.length = 0, this.#o();
    this.#e.length = 0;
  }
  #r() {
    let t = this.#e.pop();
    if (t === undefined)
      t = this.#t.length, this.#t.push(undefined), this.#o();
    return t;
  }
  #o() {
    this.length.onChange?.(this.length.valueOf());
  }
}

class h extends d {
  #t;
  #e = new Map;
  #r = new T;
  #o = new l({ informUpdate: this.informUpdate.bind(this), addElem: this.#s.bind(this), removeElem: this.#i.bind(this) });
  constructor({ onChange: t, elems: e } = {}) {
    super();
    this.#t = new p({ onChange: t }), e?.forEach((r) => this.add(r));
  }
  get length() {
    return this.#t.length;
  }
  at(t) {
    const e = this.#t.at(t);
    return e?.elems.at(e.index);
  }
  add(t) {
    const e = this.#o.create(t);
    this.#e.set(t, e);
  }
  remove(t) {
    const e = this.#e.get(t);
    if (e)
      this.#e.delete(t), this.#o.recycle(e);
  }
  clear() {
    i(this.#t, (t, e) => {
      if (this.informUpdate(e), t)
        this.#r.recycle(t);
    }), this.#t.clear();
  }
  updateFully(t) {
    for (let [e, r] of this.#e)
      i(e, (o, s) => r.onUpdate(s, t));
  }
  #s(t, e) {
    const r = this.#t.addElem(this.#r.create(t, e));
    return this.informUpdate(r), r;
  }
  #i(t) {
    const e = this.#t.removeElem(t);
    if (e)
      this.#r.recycle(e), this.informUpdate(t);
  }
}
var m = [];

class T extends a {
  constructor() {
    super((t, e, r) => {
      if (!t)
        return { elems: e, index: r };
      return t.elems = e, t.index = r, t;
    }, (t) => {
      t.elems = m;
    });
  }
}

class U {
  i;
  f;
  warningLimit = 50000;
  #t = new Set;
  #e = [];
  constructor(t, e) {
    this.initCall = t, this.onRecycle = e;
  }
  create(...t) {
    const e = this.#e.pop();
    if (e)
      return this.#t.add(e), this.initCall(e, ...t);
    const r = this.initCall(undefined, ...t);
    return this.#t.add(r), this.#o(), r;
  }
  recycle(t) {
    this.#t.delete(t), this.#r(t);
  }
  recycleAll() {
    for (let t of this.#t)
      this.#r(t);
    this.#t.clear();
  }
  clear() {
    this.#e.length = 0, this.#t.clear();
  }
  countObjectsInExistence() {
    return this.#t.size + this.#e.length;
  }
  #r(t) {
    this.#e.push(t), this.onRecycle?.(t);
  }
  #o() {
    if (this.countObjectsInExistence() === this.warningLimit)
      console.warn("ObjectPool already created", this.#t.size + this.#e.length, "in", this.constructor.name);
  }
}
export {
  h as Accumulator
};
