import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorsGridComponent } from './operators-grid.component';

describe('OperatorsGridComponent', () => {
  let component: OperatorsGridComponent;
  let fixture: ComponentFixture<OperatorsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorsGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperatorsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
