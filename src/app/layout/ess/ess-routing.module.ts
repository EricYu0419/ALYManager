import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EssComponent } from './ess.component';

const routes: Routes = [
    {
        path: '', component: EssComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EssRoutingModule {
}
