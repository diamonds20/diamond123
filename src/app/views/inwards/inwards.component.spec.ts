import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { InwardsComponent } from './inwards.component';

describe('InwardsComponent', () => {
  let component: InwardsComponent;
  let fixture: ComponentFixture<InwardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InwardsComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
