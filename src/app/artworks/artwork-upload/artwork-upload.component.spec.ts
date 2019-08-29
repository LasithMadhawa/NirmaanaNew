import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkUploadComponent } from './artwork-upload.component';

describe('ArtworkUploadComponent', () => {
  let component: ArtworkUploadComponent;
  let fixture: ComponentFixture<ArtworkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtworkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
