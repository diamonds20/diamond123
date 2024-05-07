import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { CardBodyComponent, CardGroupComponent, CardHeaderComponent, CardComponent, } from '@coreui/angular';
//import { OperatorButtonComponent } from 'src/app/views/pages/operator-button/operator-button.component';
import { CommonModule } from '@angular/common';

import { RowComponent, ColComponent } from '@coreui/angular';
import { UserService } from 'src/utils/user.service';
import { Router } from '@angular/router';

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
export class DefaultLayoutComponent {
  isCompany: boolean = false;
  public navItems = navItems;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.isCompany = true;
    this.isCompany = this.userService.getUserRole() === 'company';
  }

  navigateToOperatorsGrid() {
    this.router.navigateByUrl('/operators-grid');
  }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
