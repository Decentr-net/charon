import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclePageComponent } from './circle-page.component';

describe('CirclePageComponent', () => {
  let component: CirclePageComponent;
  let fixture: ComponentFixture<CirclePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CirclePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CirclePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
