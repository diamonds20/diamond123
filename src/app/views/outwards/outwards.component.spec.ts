import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardsComponent } from './outwards.component';

describe('OutwardsComponent', () => {
  let component: OutwardsComponent;
  let fixture: ComponentFixture<OutwardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutwardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
