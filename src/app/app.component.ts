import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditTableValueDialogComponent } from './components/edit-table-value-dialog/edit-table-value-dialog.component';
import { PeriodicElement } from './interfaces/periodic-element';
import { TableService } from './services/table/table.service';
import { RxLet } from '@rx-angular/template/let';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressBarModule, MatTooltipModule, MatFormFieldModule, MatInputModule, RxLet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [RxState]
})
export class AppComponent implements OnInit {
  public dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private tableService = inject(TableService);
  private state = inject(RxState<{ elements: PeriodicElement[], filter: string }>);

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  filteredData$ = this.state.select(
    map(({ elements, filter }) =>
      elements.filter((element: any) =>
        element.position.toString().includes(filter.toLowerCase()) ||
        element.name.toLowerCase().includes(filter.toLowerCase()) ||
        element.weight.toString().includes(filter.toLowerCase()) ||
        element.symbol.toLowerCase().includes(filter.toLowerCase())
      )
    )
  );

  loaded: boolean = false;
  loading: boolean = false;
  tooltipText: string = 'Click to change value';

  ngOnInit() {
    this.simulateDataFetch();
    this.tableService.loadElements();
    this.state.connect('elements', this.tableService.data$);
    this.state.set({ filter: '' });
  }

  simulateDataFetch() {
    setTimeout(() => {
      this.loaded = true;
      this.cdr.detectChanges();
    }, 1000);
  }

  openDialog(column: string, name: string, value: any, element: PeriodicElement) {
    this.dialog.open(EditTableValueDialogComponent, {
      data: { column, name, value, element, dataSource: this.state.get().elements }
    });
  }

  applyFilter(event: Event) {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      const filterValue = (event.target as HTMLInputElement).value;
      this.state.set({ filter: filterValue.trim().toLowerCase() });
    }, 2000);
  }
}