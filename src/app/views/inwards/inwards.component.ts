import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/utils/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CONSTANT } from 'src/constants/constants';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';
// import { ScrollingModule } from '@angular/cdk/scrolling';

// interface ResponsiveImage {
//   src: string;
//   small: string;
//   medium: string;
//   large: string;
// }

@Component({
  selector: 'app-inwards',
  standalone: true,
  imports: [CommonModule, LazyLoadImageModule],
  templateUrl: './inwards.component.html',
  styleUrls: ['./inwards.component.scss']
})
export class InwardsComponent implements OnInit, OnDestroy {

  operatorName: string = '';
  operatorRole: string = '';
  isInwardsRoute: boolean = false;
  images: string[] = [];
  // // optimizedImages: string[] = [];
  defaultImage = 'assets/images/ring1.png'
  // images: ResponsiveImage[] = [];

  // images: { src: string, alt: string }[] = [
  //   { src: 'assets/images/ring1.png', alt: 'Image 1' },
  //   { src: 'assets/images/ring2.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring3.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring4.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring5.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring6.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring7.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring8.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring9.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring10.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring11.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring12.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring13.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring14.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring15.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring16.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring17.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring18.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring19.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring20.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring21.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring22.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring23.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring24.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring25.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring26.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring27.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring28.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring29.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring30.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring31.jpg', alt: 'Image 2' },
  //   { src: 'assets/images/ring33.jpg', alt: 'Image 2' },
  // ];

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
    this.loadImages();
  }

  onImageError(event: any) {
    console.log('Image failed to load:', event);
  }

  loadImages(): void {
    // Assume these images are in your assets folder
    this.images = [
      'assets/images/ring1.png',
      'assets/images/ring2.jpg',
      'assets/images/ring3.jpg',
      'assets/images/ring4.jpg',
      'assets/images/ring5.jpg',
      'assets/images/ring6.jpg',
      'assets/images/ring7.jpg',
      'assets/images/ring8.jpg',
      'assets/images/ring9.jpg',
      'assets/images/ring10.jpg',
      'assets/images/ring11.jpg',
      'assets/images/ring12.jpg',
      'assets/images/ring13.jpg',
      'assets/images/ring14.jpg',
      'assets/images/ring15.jpg',
      'assets/images/ring16.jpg',
      'assets/images/ring17.jpg',
      'assets/images/ring18.jpg',
      'assets/images/ring19.jpg',
      'assets/images/ring20.jpg',
      'assets/images/ring21.jpg',
      'assets/images/ring22.jpg',
    ];

  //   console.log('Image paths:', this.images);

  //   this.images.forEach(imagePath => {
  //     this.optimizeImage(imagePath);
  //   });
   }

  // optimizeImage(imagePath: string): void {
  //   const img = new Image();
  //   img.onload = () => {
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');
      
  //     // Set fixed dimensions for all images
  //     const fixedWidth = 300;  // You can adjust this value
  //     const fixedHeight = 200; // You can adjust this value
  
  //     canvas.width = fixedWidth;
  //     canvas.height = fixedHeight;
  
  //     // Calculate scaling to cover the canvas while maintaining aspect ratio
  //     const scale = Math.max(fixedWidth / img.width, fixedHeight / img.height);
  //     const scaledWidth = img.width * scale;
  //     const scaledHeight = img.height * scale;
  
  //     // Center the image on the canvas
  //     const offsetX = (fixedWidth - scaledWidth) / 2;
  //     const offsetY = (fixedHeight - scaledHeight) / 2;
  
  //     // Draw image on canvas with new dimensions
  //     ctx?.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
  
  //     // Convert canvas to optimized JPEG data URL
  //     const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.8); // 0.8 is the quality (0-1)
  
  //     // Add optimized image URL to the optimizedImages array
  //     this.optimizedImages.push(optimizedDataUrl);
  //   };
  //   img.onerror = (error) => {
  //     console.error(`Error loading image ${imagePath}:`, error);
  //   };
  //   img.src = imagePath;
  // }

  // onImageError(event: any) {
  //   console.error('Image failed to load:', event);
  // }

  ngOnDestroy(): void {
    // Remove session storage items
    sessionStorage.removeItem(CONSTANT.OPERATOR_NAME_KEY);
    sessionStorage.removeItem(CONSTANT.OPERATOR_ROLE_KEY);
  }
}