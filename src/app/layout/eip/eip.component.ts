import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import {
    ApifetchService,
    Instance,
    Region,
    InstanceType,
    EipAddress
} from "../../shared";
import { SnotifyService } from "ng-snotify";
@Component({
    selector: "app-eip",
    templateUrl: "./eip.component.html",
    styleUrls: ["./eip.component.scss"],
    animations: [routerTransition()]
})
export class EipComponent implements OnInit {
    scope: {
        Regions: Array<Region>;
        Instances: Array<Instance>;
        EipAddresses: Array<EipAddress>;
    };
    loading: boolean = false;
    scopeInit() {
        this.scope = {
            Regions: [],
            Instances: [],
            EipAddresses: []
        };
    }

    constructor(
        private api: ApifetchService,
        private snotify: SnotifyService
    ) {}

    ngOnInit() {
        this.dataBind();
    }

    dataBind() {
        this.loading = true;
        this.scopeInit();
        this.api.v1EipList((err, res) => {
            this.scope = res;
            this.scope.Instances.forEach(ins => {
                ins.IsEip = ins.EipAddress.IpAddress !== "";
                ins.HasPublicIp =
                    ins.EipAddress.IpAddress !== "" ||
                    ins.PublicIpAddress.IpAddress.length > 0;
            });
            this.loading = false;
        });
    }

    public getRegionInfo(eip: EipAddress): Region {
        if (!this.scope.Regions || this.scope.Regions.length === 0)
            return new Region();
        const region = this.scope.Regions.find(e => {
            return e.RegionId === eip.RegionId;
        });

        return region;
    }

    public getChargeTypeDesc(ChargeType: string): string {
        switch (ChargeType) {
            case "PrePaid":
                return "包年包月";
            case "PostPaid":
                return "按量计费";
        }
    }

    public getInternetChargeTypeDesc(InternetChargeType: string): string {
        switch (InternetChargeType) {
            case "PayByTraffic":
                return "按流量计费";
            default:
                return "按固定带宽计费";
        }
    }

    public getEipStatus(eip: EipAddress): string {
        switch (eip.Status) {
            case "Associating":
                return "绑定中";
            case "Unassociating":
                return "解绑中";
            case "InUse":
                return "已分配";
            default:
            case "Available":
                return "可用";
        }
    }

    public getEipInstanceTypeDesc(InstanceType: string): string {
        switch (InstanceType) {
            case "EcsInstance":
                return "ECS实例";
            case "SlbInstance":
                return "负载均衡实例";
            case "Nat":
                return "NAT网关";
            case "HaVip":
                return "HaVip实例";
            default:
                return "";
        }
    }

    public getEipInstance(eip: EipAddress): Instance {
        if (!eip.InstanceId) return new Instance();
        return this.scope.Instances.find(instance => {
            return eip.InstanceId === instance.InstanceId;
        });
    }

    releaseEIP(eip: EipAddress): void {
        this.snotify.confirm(`确认要释放EIP【${eip.IpAddress}】吗?`, {
            buttons: [
                {
                    text: "确认",
                    action: toast => {
                        this.api.do(
                            "/ecs/releaseEipAddress",
                            { AllocationId: eip.AllocationId },
                            (err, res) => {
                                if (res.RequestId) {
                                    this.api.v1Tasks("EipAddressesReflash");
                                    this.snotify.success(
                                        `释放EIP【${
                                            eip.IpAddress
                                        }】成功，请等待数据刷新！`,
                                        { timeout: 3000 }
                                    );
                                    setTimeout(() => {
                                        this.dataBind();
                                    }, 3000);
                                }
                            }
                        );
                        this.snotify.remove(toast.id);
                    },
                    bold: true
                },
                { text: "取消", bold: false }
            ]
        });
    }

    unBindEIP(eip: EipAddress): void {
        this.snotify.confirm(
            `确认要解绑【${eip.InstanceId}(${
                this.getInstance(eip.InstanceId).InstanceName
            })】实例上的EIP【${eip.IpAddress}】吗?`,
            {
                buttons: [
                    {
                        text: "确认",
                        action: toast => {
                            this.api.do(
                                "/ecs/unassociateEipAddress",
                                {
                                    InstanceId: eip.InstanceId,
                                    AllocationId: eip.AllocationId
                                },
                                (err, res) => {
                                    if (res.RequestId) {
                                        this.api.v1Tasks("EipAddressesReflash");
                                        this.api.v1Tasks(
                                            "ScalingInstancesReflash"
                                        );
                                        this.api.v1Tasks(
                                            "InstanceStatusReflash"
                                        );
                                        this.snotify.success(
                                            `解绑【${eip.InstanceId}(${
                                                this.getInstance(eip.InstanceId)
                                                    .InstanceName
                                            })】实例上的EIP【${
                                                eip.IpAddress
                                            }】成功，请等待数据刷新！`,
                                            { timeout: 3000 }
                                        );
                                        setTimeout(() => {
                                            this.dataBind();
                                        }, 3000);
                                    } else {
                                        this.snotify.error(res.message);
                                    }
                                }
                            );
                            this.snotify.remove(toast.id);
                        },
                        bold: true
                    },
                    { text: "取消", bold: false }
                ]
            }
        );
    }

    public getInstance(id: string): Instance {
        return this.scope.Instances.find(ins => {
            return ins.InstanceId === id;
        });
    }

    public getInstancesByRegionId(eip: EipAddress): Array<Instance> {
        return this.scope.Instances.filter(ins => {
            return (
                ins.RegionId === eip.RegionId &&
                ins.InstanceNetworkType === "vpc" &&
                !ins.HasPublicIp
            );
        });
    }

    doBindEIP(eip: EipAddress, instance: Instance): void {
        this.snotify.confirm(
            `确认要绑定EIP【${eip.IpAddress}】到实例【${instance.InstanceId}(${
                instance.InstanceName
            })】上的吗?`,
            {
                buttons: [
                    {
                        text: "确认",
                        action: toast => {
                            this.api.do(
                                "/ecs/associateEipAddress",
                                {
                                    InstanceId: instance.InstanceId,
                                    AllocationId: eip.AllocationId
                                },
                                (err, res) => {
                                    if (res.RequestId) {
                                        this.api.v1Tasks("EipAddressesReflash");
                                        this.api.v1Tasks(
                                            "ScalingInstancesReflash"
                                        );
                                        this.api.v1Tasks(
                                            "InstanceStatusReflash"
                                        );
                                        this.snotify.success(
                                            `绑定EIP【${
                                                eip.IpAddress
                                            }】到实例【${instance.InstanceId}(${
                                                instance.InstanceName
                                            })】上成功`,
                                            { timeout: 3000 }
                                        );
                                        setTimeout(() => {
                                            this.dataBind();
                                        }, 3000);
                                    } else {
                                        this.snotify.error(res.message);
                                    }
                                }
                            );
                            this.snotify.remove(toast.id);
                        },
                        bold: true
                    },
                    { text: "取消", bold: false }
                ]
            }
        );
    }
}
