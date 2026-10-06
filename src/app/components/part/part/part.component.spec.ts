import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '@app/testing/test-providers';

import { PartComponent } from './part.component';

describe('PartComponent', () => {
  let component: PartComponent;
  let fixture: ComponentFixture<PartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartComponent],
      providers: testProviders
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
