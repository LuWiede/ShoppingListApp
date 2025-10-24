import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { List } from '../model/list.model';

const STORAGE_KEY = 'lists';

@Injectable({ providedIn: 'root' })
export class ListsService {
  private state$ = new BehaviorSubject<List[]>(this.load());
  lists$ = this.state$.asObservable();

  getById(id: string) {
    return this.state$.value.find(l => l.id === id);
  }

add(title: string, color: string) {
  const id = crypto.randomUUID();
  const next: List = { id, title, color, items: [], doneItems: [], createdAt: Date.now() };
  this.update([...this.state$.value, next]);
  return id;
}

  updateList(list: List) {
    const arr = this.state$.value.map(l => l.id === list.id ? list : l);
    this.update(arr);
  }

  remove(id: string) {
    const arr = this.state$.value.filter(l => l.id !== id || l.pinned);
    this.update(arr);
  }

  private update(arr: List[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    this.state$.next(arr);
  }

private load(): List[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);

  const seed: List[] = [{
    id: 'shopping',
    title: 'ShoppingList',
    color: '#0e5bb3',
    items: [],
    doneItems: [],
    pinned: true,
    createdAt: Date.now()
  }];

  const legacyItems = JSON.parse(localStorage.getItem('items') || '[]');
  const legacyDone  = JSON.parse(localStorage.getItem('doneitems') || '[]');
  if (Array.isArray(legacyItems)) seed[0].items = legacyItems;
  if (Array.isArray(legacyDone))  seed[0].doneItems = legacyDone;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

getAll(): List[] {
  return this.state$.value;
}

setAll(arr: List[]) {
  this.update(arr);
}

}