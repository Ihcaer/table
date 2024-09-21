import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { PeriodicElement } from '../../interfaces/periodic-element';
import { ELEMENT_DATA } from '../../mock/ELEMENT_DATA';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private state = rxState<{ elements: PeriodicElement[] }>(({ set }) => {
    set({ elements: [] });
  })

  data$ = this.state.select('elements');

  loadElements() {
    const elementsWithId = ELEMENT_DATA.map((element, index) => ({
      ...element,
      id: index + 1
    }));

    this.state.set({ elements: elementsWithId });
  }

  updateElement(updatedElement: PeriodicElement) {
    this.state.set((current) => {
      const updatedElements = current.elements.map((el) =>
        el['id'] === updatedElement['id'] ? updatedElement : el
      );

      updatedElements.sort((a, b) => a.position - b.position);

      return {
        elements: updatedElements
      };
    });
  }

}
