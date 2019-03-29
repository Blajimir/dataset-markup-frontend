import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeRectComponent } from './resize-rect.component';

describe('ResizeRectComponent', () => {
  let component: ResizeRectComponent;
  let fixture: ComponentFixture<ResizeRectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizeRectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeRectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
