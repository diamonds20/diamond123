import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { OperatorsGridComponent } from './operators-grid.component';

describe('OperatorsGridComponent', () => {
  let component: OperatorsGridComponent;
  let fixture: ComponentFixture<OperatorsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OperatorsGridComponent, HttpClientTestingModule, NoopAnimationsModule ],
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
