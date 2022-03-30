import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConditionPageRoutingModule } from './condition-routing.module';

import { ConditionPage } from './condition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConditionPageRoutingModule
  ],
  declarations: [ConditionPage]
})
export class ConditionPageModule {}
