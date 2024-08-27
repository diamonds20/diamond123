import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DiamondsComponent } from './diamonds.component';

describe('DiamondsComponent', () => {
  let component: DiamondsComponent;
  let fixture: ComponentFixture<DiamondsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiamondsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'mockValue'
              }
            }
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiamondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
