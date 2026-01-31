import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpartComponent } from './newpart.component';

describe('NewpartComponent', () => {
  let component: NewpartComponent;
  let fixture: ComponentFixture<NewpartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewpartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewpartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
