import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorksComponent } from './manage-works.component';

describe('ManageWorksComponent', () => {
  let component: ManageWorksComponent;
  let fixture: ComponentFixture<ManageWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageWorksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
