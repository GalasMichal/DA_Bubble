import { NgModule } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

const Materialcomponents = [
  MatButton,
  MatIcon
]

@NgModule({
  imports: [
    Materialcomponents
  ],
  exports: [
    Materialcomponents
  ]
})
export class MaterialModule { }