import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAlumnosClasePage } from './add-alumnos-clase.page';

describe('AddAlumnosClasePage', () => {
  let component: AddAlumnosClasePage;
  let fixture: ComponentFixture<AddAlumnosClasePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddAlumnosClasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
