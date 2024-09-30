import { Component, OnInit } from '@angular/core';
import {
  trigger,
  transition,
  state,
  animate,
  style,
  keyframes,
} from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-open-close',
  templateUrl: 'open-close.component.4.html',
  styleUrls: ['open-close.component.scss'],
  animations: [
    trigger('childAnimation', [
      // ...
      state(
        'open',
        style({
          width: '60px',
          opacity: 1.0,
          backgroundColor: 'yellow',
          marginLeft: '-215%',
          marginTop: '-99%',
          transition: 'all 2s ease-in-out',
        })
      ),
      state(
        'closed',
        style({
          width: '50px',
          opacity: 0.8,
          backgroundColor: 'blue',
        })
      ),
      // transition('* => *', [animate('2s')]),
       // Move left first, then up-left
       transition('closed => open', [
        animate('1s ease-in-out', keyframes([
          style({ marginLeft: '-20%', offset: 0 }),   // Start at -50%
          style({ marginLeft: '-40%', offset: 0.33 }), 
          //style({ marginLeft: '-50%', offset: 0.66 }), 
         // style({ marginLeft: '-80%', offset: 1.0 })  
          // style({ transform: 'translateX(-50%)', offset: 0 }),  
          //style({ transform: 'translate(0%, -50)', offset: 1.0 })  
        ]))
      ]),
    ]),
  ],
})
export class OpenCloseChildComponent implements OnInit {

  isDisabled = false;
  isOpen = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.toggle();
    },1500)
    // this.toggleAnimations();
    //this.toggle();
  }

  // toggleAnimations(): void {
  //   this.isDisabled = !this.isDisabled;
  // }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
