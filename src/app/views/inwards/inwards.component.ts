import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { UserService } from 'src/utils/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CONSTANT } from 'src/constants/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inwards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inwards.component.html',
  styleUrls: ['./inwards.component.scss']
})
export class InwardsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChildren('imageContainer') imageContainers!: QueryList<ElementRef>;

  images: { id: number, url: string, loaded: boolean }[] = [];
  defaultImage = 'https://placehold.co/600x400?text=Loading...';
  private observer: IntersectionObserver | null = null;
  private currentId = 1;
  operatorName: string = '';
  operatorRole: string = '';
  isInwardsRoute: boolean = false;

  constructor(private userService: UserService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.operatorName = sessionStorage.getItem(CONSTANT.OPERATOR_NAME_KEY) || '';
    this.operatorRole = sessionStorage.getItem(CONSTANT.OPERATOR_ROLE_KEY) || '';

    // If not found in session storage, get from UserService
    if (!this.operatorName || !this.operatorRole) {
      this.operatorName = this.userService.getOperatorName();
      this.operatorRole = this.userService.getOperatorRole();

      sessionStorage.setItem(CONSTANT.OPERATOR_NAME_KEY, this.operatorName);
      sessionStorage.setItem(CONSTANT.OPERATOR_ROLE_KEY, this.operatorRole);
    }

    console.log(`${CONSTANT.RETRIEVED_OPERATOR_NAME}: ${this.operatorName}`);

    // Check if the current route is '/inwards'
    this.isInwardsRoute = this.router.url.includes(CONSTANT.INWARDS_PATH);

    if (this.isInwardsRoute) {
      console.log(`${CONSTANT.RETRIEVED_OPERATOR_ROLE}: ${CONSTANT.ROLE1}`);
    } else {
      console.log(`${CONSTANT.RETRIEVED_OPERATOR_ROLE}: ${this.operatorRole}`);
    }
    this.generateImagePlaceholders();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  private generateImagePlaceholders(): void {
    for (let i = 0; i < 100; i++) {
      this.images.push({ id: this.currentId++, url: '', loaded: false });
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const imageId = Number(element.dataset['imageId']);
          this.loadImage(imageId);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.imageContainers.forEach(container => {
      this.observer?.observe(container.nativeElement);
    });
  }

  private loadImage(id: number): void {
    const image = this.images.find(img => img.id === id);
    if (image && !image.loaded) {
      const width = 300 + Math.floor(Math.random() * 300);
      const height = 200 + Math.floor(Math.random() * 200);
      image.url = `https://placehold.co/${width}x${height}?text=Image${id}`;
      image.loaded = true;
    }
  }

  onImageError(event: any) {
    console.log('Image failed to load:', event);
    event.target.src = this.defaultImage;
  }


  ngOnDestroy(): void {
    // Remove session storage items
    sessionStorage.removeItem(CONSTANT.OPERATOR_NAME_KEY);
    sessionStorage.removeItem(CONSTANT.OPERATOR_ROLE_KEY);
  }
}