import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCvComponent } from './manage-cv.component';

describe('ManageCvComponent', () => {
  let component: ManageCvComponent;
  let fixture: ComponentFixture<ManageCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
