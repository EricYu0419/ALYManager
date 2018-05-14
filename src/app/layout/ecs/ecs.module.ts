import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EcsRoutingModule } from "./ecs-routing.module";
import { EcsComponent } from "./ecs.component";
import { PageHeaderModule } from "./../../shared";

@NgModule({
    imports: [CommonModule, EcsRoutingModule, PageHeaderModule],
    declarations: [EcsComponent]
})
export class EcsModule {}
