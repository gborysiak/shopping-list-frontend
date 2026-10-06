import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '@app/testing/test-providers';

import { CategorysComponent } from './categorys.component';

describe('CategorysComponent', () => {
  let component: CategorysComponent;
  let fixture: ComponentFixture<CategorysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorysComponent],
      providers: testProviders
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
