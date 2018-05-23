import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { EipRoutingModule } from "./eip-routing.module";

import { PageHeaderModule, LoadingModule } from "./../../shared";
import { EipComponent } from "./eip.component";
import { CardheadBtnModalComponent } from './components/cardhead-btn-modal/cardhead-btn-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule.forRoot(),
        EipRoutingModule,
        PageHeaderModule,
        LoadingModule
    ],
    declarations: [EipComponent, CardheadBtnModalComponent]
})
export class EipModule {}
