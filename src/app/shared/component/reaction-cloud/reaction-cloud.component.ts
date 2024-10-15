import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-reaction-cloud',
  standalone: true,
  imports: [],
  templateUrl: './reaction-cloud.component.html',
  styleUrl: './reaction-cloud.component.scss'
})
export class ReactionCloudComponent {

  @Input() name: string | undefined
  @Input() symbol: string = ""


}
