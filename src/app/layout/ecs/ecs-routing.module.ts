import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcsComponent } from './ecs.component';

const routes: Routes = [
    {
        path: '', component: EcsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcsRoutingModule {
}
