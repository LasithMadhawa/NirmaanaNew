import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkViewComponent } from './artwork-view.component';

describe('ArtworkViewComponent', () => {
  let component: ArtworkViewComponent;
  let fixture: ComponentFixture<ArtworkViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtworkViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
