import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMarkupComponent } from './image-markup.component';

describe('ImageMarkupComponent', () => {
  let component: ImageMarkupComponent;
  let fixture: ComponentFixture<ImageMarkupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageMarkupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
