import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditTableValueDialogComponent } from './components/edit-table-value-dialog/edit-table-value-dialog.component';

export interface PeriodicElement {
  [key: string]: any;
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTableModule, MatProgressBarModule, MatTooltipModule, MatFormFieldModule, MatInputModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  loaded: boolean = false;
  loading: boolean = false;
  tooltipText: string = 'Click to change value';

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.simulateDataFetch();
  }

  simulateDataFetch() {
    setTimeout(() => {
      this.loaded = true;
      this.cdr.detectChanges();
    }, 1000);
  }

  openDialog(column: string, name: string, value: any, element: PeriodicElement) {
    const dialogRef = this.dialog.open(EditTableValueDialogComponent, { data: { column, name, value, element, dataSource: this.dataSource.data } });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        element[column] = result;
        this.dataSource.data.sort((a, b) => a.position - b.position);
        this.dataSource.data = [...this.dataSource.data];
      }
    });
  }

  applyFilter(event: Event) {
    this.loading = true;
    const filterValue = (event.target as HTMLInputElement).value;

    setTimeout(() => {
      this.loading = false;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }, 2000);
  }
}
