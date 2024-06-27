import { Component, Input, DestroyRef, inject, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../../utils/user.service';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/utils/auth.service';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  ThemeDirective
} from '@coreui/angular';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, filter, map, tap } from 'rxjs/operators';
import { DocsExampleComponent } from '@docs-components/public-api';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [ContainerComponent, DocsExampleComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressBarDirective, ProgressComponent, NgStyle]
})
export class DefaultHeaderComponent extends HeaderComponent {
  welcomeMessage: string = '';
  
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone, private userService: UserService, private router: Router, private authService: AuthService) {
    super();
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  @Input() sidebarId: string = 'sidebar1';

  ngOnInit() {
      this.ngZone.run(() => {
        const storedWelcomeMessage = localStorage.getItem('welcomeMessage');
      if (storedWelcomeMessage) {
        this.welcomeMessage = storedWelcomeMessage;
      } else {
        this.setWelcomeMessage();
      }
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    localStorage.removeItem('welcomeMessage');
  }


    private setWelcomeMessage() {
      const userRole = this.userService.getUserRole();
      const companyName = this.userService.getCompanyName();
      switch (userRole) {
        case 'superadmin':
          this.welcomeMessage = 'Welcome, SuperAdmin!';
          break;
        case 'company':
          this.welcomeMessage = `Welcome, ${companyName}!`;
          break;
        case 'operator':
          this.welcomeMessage = 'Welcome, Operator!';
          break;
        default:
          this.welcomeMessage = 'Welcome!';
      }
      this.saveWelcomeMessageToLocalStorage(this.welcomeMessage);
    }
    private saveWelcomeMessageToLocalStorage(message: string) {
      localStorage.setItem('welcomeMessage', message);
    }

    logout(): void {
      this.router.navigate(['/login']);
      localStorage.removeItem('authToken');
      localStorage.removeItem('auth_token');
    }
}
