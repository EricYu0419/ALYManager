import { Component, OnInit, Input } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ApifetchService, Instance } from "../../../../shared";
import { SnotifyService } from "ng-snotify";

@Component({
    selector: "app-converteip-modal",
    templateUrl: "./converteip-modal.component.html",
    styleUrls: ["./converteip-modal.component.scss"]
})
export class ConverteipModalComponent implements OnInit {
    @Input() Instance: Instance;
    closeResult: string;

    constructor(
        private api: ApifetchService,
        private modalService: NgbModal,
        private snotify: SnotifyService
    ) {}

    ngOnInit() {}

    openConverteip(converteip) {
        this.modalService
            .open(converteip, {
                size: "lg"
            })
            .result.then(
                result => {
                    if (result === "doConverteip") {
                        this.doConverteip();
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

    openConvertpip(changepip) {
        this.modalService
            .open(changepip, {
                size: "lg"
            })
            .result.then(
                result => {
                    if (result === "doConvertpip") {
                        this.doConvertpip();
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
    // 普通公网（Public）转弹性公网（EIP）
    doConverteip() {
        this.snotify.confirm(
            `确定要将【${this.Instance.InstanceName}】转为弹性公网（EIP）？`,
            {
                buttons: [
                    {
                        text: "确认",
                        action: () => {
                            this.api.do(
                                "/ecs/convertNatPublicIpToEip",
                                {
                                    RegionId: this.Instance.RegionId,
                                    InstanceId: this.Instance.InstanceId
                                },
                                (err, res) => {
                                    console.info(err, res);
                                    if (res.RequestId) {
                                        this.api.v1Tasks(
                                            "InstanceStatusReflash"
                                        );
                                        this.api.v1Tasks("EipAddressesReflash");
                                        this.snotify.success(
                                            `普通公网（Public）转弹性公网（EIP） 成功，IP不变，请等待后端数据刷新！`
                                        );
                                    } else {
                                        this.snotify.error(res.message);
                                    }
                                }
                            );
                        },
                        bold: true
                    },
                    {
                        text: "取消",
                        bold: false
                    }
                ]
            }
        );
    }

    doConvertpip() {
        let oldId = this.Instance.EipAddress.AllocationId;
        let oldEip = this.Instance.EipAddress.IpAddress;
        this.api.do(
            "/ecs/unassociateEipAddress",
            {
                InstanceId: this.Instance.InstanceId,
                AllocationId: oldId
            },
            (err, res) => {
                if (res.RequestId) {
                    this.Instance.EipAddress.IpAddress = "";
                    this.Instance.EipAddress.AllocationId = "";
                    this.Instance.IsEip = false;
                    this.Instance.HasPublicIp = false;
                    this.api.v1Tasks("InstanceStatusReflash");
                    this.api.v1Tasks("EipAddressesReflash");
                    this.snotify.success("解绑成功，请等待后端数据刷新！");
                } else {
                    this.snotify.error(res.message);
                }
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
