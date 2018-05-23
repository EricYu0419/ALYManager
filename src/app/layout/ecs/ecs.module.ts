import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule as Ng2Charts } from "ng2-charts";

import { EcsRoutingModule } from "./ecs-routing.module";
import { EcsComponent } from "./ecs.component";
import { PageHeaderModule,LoadingModule } from "./../../shared";
import { InstanceModalComponent } from "./components/instance-modal/instance-modal.component";
import { RenewModalComponent } from "./components/renew-modal/renew-modal.component";
import { MonitorModalComponent } from "./components/monitor-modal/monitor-modal.component";
import { ConverteipModalComponent } from './components/converteip-modal/converteip-modal.component';

@NgModule({
    imports: [
        CommonModule,
        Ng2Charts,
        FormsModule,
        NgbModule.forRoot(),
        NgbDropdownModule.forRoot(),
        EcsRoutingModule,
        PageHeaderModule,
        LoadingModule
    ],
    declarations: [
        EcsComponent,
        InstanceModalComponent,
        RenewModalComponent,
        MonitorModalComponent,
        ConverteipModalComponent
        
    ]
})
export class EcsModule {}
