import { ComponentFixture, TestBed } from '@angular/core/testing';

// 1. Import the correct class name (DashboardComponent)
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => { // 2. Update the description
  let component: DashboardComponent; // 3. Update the type
  let fixture: ComponentFixture<DashboardComponent>; // 4. Update the type

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent], // 5. Update the import array
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent); // 6. Update the component creation
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});