import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    RouterLink,
    
  ],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss'
})
export class ChannelCreateComponent {

  constructor(private dialogRef: MatDialogRef<ChannelCreateComponent>) { }

  closeModal() {
    this.dialogRef.close();
  }
}
