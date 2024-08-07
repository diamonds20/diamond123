import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diamonds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diamonds.component.html',
  styleUrl: './diamonds.component.scss'
})
export class DiamondsComponent implements OnInit {
  @ViewChild('diamondGif') diamondGif!: ElementRef;
  isAnimating: boolean = true;
  gifUrl: string = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWFxeW0yOGVubTJ0bmJmaTJkOWQ0OTB2NGE4NTdsa2djY2llZHY5byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nfAMS5TUUgw9i/giphy.gif';
  boxes: number[] = [1, 2, 3, 4, 5];
  selectedDiamond: string | null = null;
  diamondImageUrl: string = 'assets/images/diamond.png';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const keys = Object.keys(params);
      if (keys.length > 0) {
        this.selectedDiamond = keys[0];
      } else {
        this.selectedDiamond = null;
      }
    });
  }

  selectDiamond(diamondId: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [diamondId]: '' },
      queryParamsHandling: 'merge'
    });
  }
}