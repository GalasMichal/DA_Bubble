import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss'
})

export class IndexPageComponent {

  readonly router = inject(Router);

  @ViewChild('logo', { static: true }) logo!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    // Initial movement to the left
    setTimeout(() => {
      if (this.logo) {
        this.logo.nativeElement.classList.add('move-to-left');

      }
  
      // Phase 2: After a delay, move the logo to the top-left corner
      setTimeout(() => {
        if (this.logo) {
          //this.logo.nativeElement.classList.remove('move-to-left');
          this.logo.nativeElement.classList.add('move-to-top-left');
          
        }
      }, 3000);  // This should match the duration of the first movement
  
    }, 1000); // Initial delay for the first movement

    

    // setTimeout(() => {
    //   this.router.navigate(['/start']); 
    // }, 5000); // Adjust as needed
  }

}
