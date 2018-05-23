import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EipComponent } from "./eip.component";

const routes: Routes = [
    {
        path: "",
        component: EipComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EipRoutingModule {}
