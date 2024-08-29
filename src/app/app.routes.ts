import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content/main-content.component';
import { MenuSideLeftComponent } from './main-content/menu-side-left/menu-side-left/menu-side-left.component';
import { LegalComponent } from './legal/legal.component';
import { ImprintComponent } from './imprint/imprint.component';

export const routes: Routes = [
  { path: 'main', component: MainContentComponent },
  { path: '', component: MenuSideLeftComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'imprint', component: ImprintComponent },
];
