import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { CardBodyComponent, CardGroupComponent, CardHeaderComponent, CardComponent, } from '@coreui/angular';
//import { OperatorButtonComponent } from 'src/app/views/pages/operator-button/operator-button.component';
import { CommonModule } from '@angular/common';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, ColComponent } from '@coreui/angular';
import { UserService } from 'src/utils/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Operator } from 'src/utils/models';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    DocsExampleComponent,
    RowComponent,
    ColComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    CommonModule,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent
  ]
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  isCompany: boolean = false;
  isOperator: boolean = false;
  public navItems = navItems;
  userRole: string = '';
  companyName: string = '';
  operatorRole: string = '';
  private subscriptions: Subscription[] = [];
  showInwardsButton: boolean = false;
  showCompareButton: boolean = false;
  showOutwardsButton: boolean = false;

  constructor(private userService: UserService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const storedButtonState = localStorage.getItem('showOperatorsGridButton');
    if (storedButtonState) {
      this.isCompany = JSON.parse(storedButtonState);
    } else {
      this.subscriptions.push(
        this.userService.userRole$.subscribe(role => {
          this.userRole = role;
          this.isOperator = role === 'operator';
          this.isCompany = role === 'company';
          this.setButtonStateInLocalStorage(this.isCompany);

        }),
      )
      // Check if button states exist in session storage
    const inwardsButtonState = localStorage.getItem('showInwardsButton');
    const compareButtonState = localStorage.getItem('showCompareButton');
    const outwardsButtonState = localStorage.getItem('showOutwardsButton');

    if (inwardsButtonState && compareButtonState && outwardsButtonState) {
      this.showInwardsButton = JSON.parse(inwardsButtonState);
      this.showCompareButton = JSON.parse(compareButtonState);
      this.showOutwardsButton = JSON.parse(outwardsButtonState);
    } else {
      // Subscribe to the operatorRole$ observable
      this.subscriptions.push(
        this.userService.operatorRole$.subscribe(role => {
          this.operatorRole = role;
          console.log('Operator Role:', role);
          const roles = role.split(',');
          this.showInwardsButton = roles.includes('Role 1');
          this.showCompareButton = roles.includes('Role 2');
          this.showOutwardsButton = roles.includes('Role 3');
          this.setButtonStatesInLocalStorage();
          this.cdr.detectChanges();
        })
      );
    }
    }

    //
    this.subscriptions.push(
      this.userService.operatorRole$.subscribe(role => {
        this.operatorRole = role;
        console.log('Operator Role:', role);
        if (role === 'Role 1') {
          console.log('User has Role 1 role');
        } else if (role === 'Role 2') {
          console.log('User has Role 2 role');
        } else if (role === 'Role 3') {
          console.log('User has Role 3 role');
        } else if (role.includes('Role 1') && role.includes('Role 2')) {
          console.log('User has Role 1 and Role 2 roles');
        } else if (role.includes('Role 1') && role.includes('Role 3')) {
          console.log('User has Role 1 and Role 3 roles');
        } else if (role.includes('Role 2') && role.includes('Role 3')) {
          console.log('User has Role 2 and Role 3 roles');
        } else if (role.includes('Role 1') && role.includes('Role 2') && role.includes('Role 3')) {
          console.log('User has Role 1, Role 2 and Role 3 roles');
        } else {
          console.log('User does not have Role 1, Role 2, or Role 3 role');
        }
        this.cdr.detectChanges();
      })
    );
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    localStorage.removeItem('showOperatorsGridButton');
    localStorage.removeItem('showInwardsButton');
    localStorage.removeItem('showCompareButton');
    localStorage.removeItem('showOutwardsButton');
  }

  navigateToOperatorsGrid() {
    if (this.isCompany) {
      this.router.navigateByUrl('/operators-grid');
    }
  }

  navigateToInwardsPage() {
    if (this.isOperator) {
      this.router.navigate(['/inwards']);
    }
  }

  navigateToComparePage() {
    if (this.isOperator) {
      this.router.navigate(['/compare']);
    }
  }

  navigateToOutwardsPage() {
    if (this.isOperator) {
      this.router.navigate(['/outwards']);
    }
  }

  navigateToDiamondsPage() {
    if (this.isOperator) {
      this.router.navigate(['/diamonds']);
    }
  }


  private setButtonStateInLocalStorage(state: boolean) {
    localStorage.setItem('showOperatorsGridButton', JSON.stringify(state));
  }

  private setButtonStatesInLocalStorage() {
    localStorage.setItem('showInwardsButton', JSON.stringify(this.showInwardsButton));
    localStorage.setItem('showCompareButton', JSON.stringify(this.showCompareButton));
    localStorage.setItem('showOutwardsButton', JSON.stringify(this.showOutwardsButton));
  }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
