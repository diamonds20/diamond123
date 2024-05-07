import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { cilPeople } from '@coreui/icons';
import { CommonModule, JsonPipe } from '@angular/common';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { TableModule, FormModule, GridModule, CardHeaderComponent } from '@coreui/angular';
import { NgStyle } from '@angular/common';
import { IconDirective, IconModule, IconSetService } from '@coreui/icons-angular';
import { iconSubset } from 'src/app/icons/icon-subset';

@Component({
  selector: 'app-operators-grid.component',
  templateUrl: './operators-grid.component.html',
  styleUrls: ['./operators-grid.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, IconModule, TableModule, CardHeaderComponent, IconDirective, FormModule, GridModule, JsonPipe, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle],
})
export class OperatorsGridComponent implements OnInit {
  operators: any[] = [];
  iconSetService: IconSetService;

  constructor(private http: HttpClient, iconSetService: IconSetService, private router: Router,) {
    this.iconSetService = iconSetService;
  }

  ngOnInit() {
    console.log('Entering ngOnInit');

    console.log('Making API call to /http://localhost:5000/api/login');
    this.http.post('/http://localhost:5000/api/login', { username: 'operator_username' })
      .subscribe(
        (response: any) => {
          console.log('API response:', response);
          if (response.isOperator) {
            this.operators = [response];
            console.log('Operators array:', this.operators);
          } else {
            console.log('Response does not contain isOperator property');
          }
        },
        (error) => {
          console.error('Error fetching operator data:', error);
        }
      );

    console.log('Exiting ngOnInit');
  }
}