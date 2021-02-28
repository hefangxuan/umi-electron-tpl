import store from 'electron-store';

export class Store {
  private store: store;
  constructor(options: any) {
    this.store = new store(options);
  }
  public get(name: string | string[]): any {
    if (Array.isArray(name)) {
      return name.map((n) => this.store.get(n));
    } else {
      return this.store.get(name);
    }
  }
  public set(key: string, val: any): void {
    this.store.set(key, val);
  }
  public delete(key: string | string[]): void {
    if (Array.isArray(key)) {
      key.forEach((k) => this.store.delete(k));
    } else {
      this.store.delete(key);
    }
  }
}
