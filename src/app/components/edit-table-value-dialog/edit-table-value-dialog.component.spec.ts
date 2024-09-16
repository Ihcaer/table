import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTableValueDialogComponent } from './edit-table-value-dialog.component';

describe('EditTableValueDialogComponent', () => {
  let component: EditTableValueDialogComponent;
  let fixture: ComponentFixture<EditTableValueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTableValueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTableValueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
