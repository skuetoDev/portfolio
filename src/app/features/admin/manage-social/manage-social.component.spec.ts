import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSocialComponent } from './manage-social.component';

describe('ManageSocialComponent', () => {
  let component: ManageSocialComponent;
  let fixture: ComponentFixture<ManageSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSocialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
