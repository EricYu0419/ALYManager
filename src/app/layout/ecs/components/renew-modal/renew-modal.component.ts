import { Component, OnInit, Input } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ApifetchService,Instance } from "../../../../shared";
@Component({
    selector: "app-renew-modal",
    templateUrl: "./renew-modal.component.html",
    styleUrls: ["./renew-modal.component.scss"]
})
export class RenewModalComponent implements OnInit {
    @Input() Instance: Instance;
    RenewInstance: {
        InstanceId: string;
        PeriodUnit: string;
        Period: string;
    };

    closeResult: string;
    constructor(private modalService: NgbModal, private api: ApifetchService) {}

    ngOnInit() {
        this.RenewInstance = {
            InstanceId: this.Instance.InstanceId,
            PeriodUnit: "Month",
            Period: "1"
        };
    }

    openRenew(renew) {
        this.modalService
            .open(renew, {
                windowClass: "dark-modal",
                size: "lg"
            })
            .result.then(
                result => {
                    console.info(result);
                    if (result === "confirm") {
                        this.api.renewECS(this.RenewInstance, function(
                            err,
                            res
                        ) {});
                    }
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.getDismissReason(
                        reason
                    )}`;
                }
            );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return "by pressing ESC";
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return "by clicking on a backdrop";
        } else {
            return `with: ${reason}`;
        }
    }
}
