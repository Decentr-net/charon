import { Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

export type SlotTemplate = TemplateRef<{ rootElement: HTMLElement }>;

@Injectable()
export class SlotService {
  private readonly slotMap: Map<symbol, SlotTemplate> = new Map();

  private readonly slotMapChanged$: Subject<symbol> = new Subject();

  public registerSlot(name: symbol, template: SlotTemplate): void {
    this.slotMap.set(name, template);
    this.slotMapChanged$.next(name);
  }

  public unregisterSlot(name: symbol): void {
    this.slotMap.delete(name);
    this.slotMapChanged$.next(name);
  }

  public getSlotTemplate(name: symbol): Observable<SlotTemplate> {
    return this.slotMapChanged$.pipe(
      filter((changedName) => changedName === name),
      map(() => this.slotMap.get(name)),
      startWith(this.slotMap.get(name)),
      distinctUntilChanged(),
    );
  }
}
