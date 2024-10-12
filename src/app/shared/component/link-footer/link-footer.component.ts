import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-link-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './link-footer.component.html',
  styleUrl: './link-footer.component.scss'
})
export class LinkFooterComponent {

}
