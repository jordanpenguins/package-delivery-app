import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDriverComponent } from './list-driver.component';

describe('ListDriverComponent', () => {
  let component: ListDriverComponent;
  let fixture: ComponentFixture<ListDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDriverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
