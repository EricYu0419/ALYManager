import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { EssRoutingModule } from "./ess-routing.module";

import { PageHeaderModule, LoadingModule } from "./../../shared";
import { EssComponent } from "./ess.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule.forRoot(),
        EssRoutingModule,
        PageHeaderModule,
        LoadingModule
    ],
    declarations: [EssComponent]
})
export class EssModule {}
