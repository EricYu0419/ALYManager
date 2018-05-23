import { Component, OnInit, Input, Output } from "@angular/core";
import { Region, EipAddress, ApifetchService } from "../../../../shared";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-instance-modal",
    templateUrl: "./instance-modal.component.html",
    styleUrls: ["./instance-modal.component.scss"]
})
export class InstanceModalComponent implements OnInit {
    @Input()
    @Output()
    Regions: Array<Region>;

    closeResult: string;
    eipOptions: {
        RegionId: string;
        Bandwidth: number;
        InternetChargeType: string;
    };
    constructor(private modalService: NgbModal, private api: ApifetchService) {}

    ngOnInit() {
        this.eipOptions = {
            RegionId: "cn-shenzhen",
            Bandwidth: 100,
            InternetChargeType: "PayByTraffic"
        };
    }

    open(content) {
        console.info("modal open!");
        this.modalService
            .open(content, {
                windowClass: "dark-modal",
                size: "lg"
            })
            .result.then(
                result => {
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.getDismissReason(
                        reason
                    )}`;
                }
            );
    }

    openNeweip(neweip) {
        this.modalService
            .open(neweip, {
                size: "lg"
            })
            .result.then(
                result => {
                    if (result === "doChangeeip") {
                        this.api.do(
                            "/ecs/allocateEipAddress",
                            this.eipOptions,
                            (err, res) => {
                                if (res.RequestId) {
                                    this.api.v1Tasks('EipAddressesReflash');
                                    alert("新EIP申请成功，请等待后台刷新更新！");
                                }
                            }
                        );
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
