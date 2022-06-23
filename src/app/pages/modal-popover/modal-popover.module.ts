import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPopoverPageRoutingModule } from './modal-popover-routing.module';

import { ModalPopoverPage } from './modal-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalPopoverPageRoutingModule
  ],
  declarations: [ModalPopoverPage]
})
export class ModalPopoverPageModule {}
