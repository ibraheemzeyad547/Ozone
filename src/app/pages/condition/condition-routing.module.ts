import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConditionPage } from './condition.page';

const routes: Routes = [
  {
    path: '',
    component: ConditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConditionPageRoutingModule {}
