import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarProfesorPage } from './agregar-profesor.page';

describe('AgregarProfesorPage', () => {
  let component: AgregarProfesorPage;
  let fixture: ComponentFixture<AgregarProfesorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregarProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
