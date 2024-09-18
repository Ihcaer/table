import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElement } from '../../app.component';

@Component({
  selector: 'app-edit-table-value-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, FormsModule, MatInputModule],
  templateUrl: './edit-table-value-dialog.component.html',
  styleUrl: './edit-table-value-dialog.component.scss',
})
export class EditTableValueDialogComponent {
  public dialogRef = inject(MatDialogRef<EditTableValueDialogComponent>);
  updatedValue: string | number;
  sameValue: boolean = false;
  takenValue: boolean = false;
  invalidNumber: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { column: string, name: string, value: string | number, dataSource: PeriodicElement[] }) {
    this.updatedValue = data.value;
  }

  onValueChange() {
    this.sameValue = false;
    this.takenValue = false;
    this.invalidNumber = false;
  }

  save() {
    if (this.data.column === 'position' || this.data.column === 'weight') {
      this.updatedValue = +this.updatedValue;
    }

    if (this.updatedValue === '') {
      return
    }
    else if (this.updatedValue === 0) {
      this.updatedValue = '';
      return
    } else if (this.updatedValue === this.data.value) {
      this.sameValue = true;
    } else if (typeof this.updatedValue === 'number') {
      if (isNaN(this.updatedValue)) {
        this.invalidNumber = true;
        this.updatedValue = '';
      }
    }
    else if (this.data.dataSource.some(el => el.position === this.updatedValue)) {
      this.takenValue = true;
    } else {
      this.dialogRef.close(this.updatedValue);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
