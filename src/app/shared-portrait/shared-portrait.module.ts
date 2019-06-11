import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PortraitSelectorComponent } from './portrait-selector/portrait-selector.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    PortraitSelectorComponent
  ],
  exports: [
    PortraitSelectorComponent
  ]
})
export class PortraitImageSharedModule {}
