import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateDistanceComponent } from './calculate-distance.component';

describe('CalculateDistanceComponent', () => {
  let component: CalculateDistanceComponent;
  let fixture: ComponentFixture<CalculateDistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculateDistanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculateDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
