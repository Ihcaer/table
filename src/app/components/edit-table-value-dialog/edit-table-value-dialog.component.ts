import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElement } from '../../interfaces/periodic-element';
import { TableService } from '../../services/table/table.service';

@Component({
  selector: 'app-edit-table-value-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, FormsModule, MatInputModule],
  templateUrl: './edit-table-value-dialog.component.html',
  styleUrl: './edit-table-value-dialog.component.scss'
})
export class EditTableValueDialogComponent {
  public dialogRef = inject(MatDialogRef<EditTableValueDialogComponent>);
  private tableService = inject(TableService);

  updatedValue: string | number;
  sameValue: boolean = false;
  takenValue: boolean = false;
  invalidNumber: boolean = false;
  positionZero: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { column: string, name: string, value: string | number, element: PeriodicElement, dataSource: PeriodicElement[] }) {
    this.updatedValue = data.value;
  }

  onValueChange() {
    this.sameValue = false;
    this.takenValue = false;
    this.invalidNumber = false;
    this.positionZero = false;
  }

  isNumericField(column: string): boolean {
    return column === 'position' || column === 'weight';
  }

  cantBeDuplicated(column: string): boolean {
    return column === 'position' || column === 'name' || column === 'symbol';
  }

  isValueTaken(column: string, value: string | number): boolean {
    if (column === 'name') {
      return this.data.dataSource.some(el => el[column].toLowerCase() === (value as string).toLowerCase() && el['id'] !== this.data.element['id']);
    } else if (column === 'position') {
      return this.data.dataSource.some(el =>
        String(el[column]) === String(value) && el['id'] !== this.data.element['id']
      );
    } else {
      return this.data.dataSource.some(el =>
        el[column] === value && el['id'] !== this.data.element['id']
      );
    }
  }

  save() {
    if (this.isNumericField(this.data.column) && isNaN(+this.updatedValue)) {
      this.invalidNumber = true;
      return;
    }

    if (this.updatedValue === '') {
      return
    } else if (this.updatedValue === this.data.value) {
      this.sameValue = true;
    } else if (this.cantBeDuplicated(this.data.column) && this.isValueTaken(this.data.column, this.updatedValue)) {
      this.takenValue = true;
      return;
    } else if (this.data.column === 'position' && this.updatedValue === '0') {
      this.positionZero = true;
      return;
    } else {
      const updatedElement = { ...this.data.element, [this.data.column]: this.updatedValue };
      this.tableService.updateElement(updatedElement);

      this.dialogRef.close();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
