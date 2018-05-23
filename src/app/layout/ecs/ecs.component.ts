import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import {
    ApifetchService,
    Instance,
    Region,
    InstanceType,
    InstanceChargeType,
    Zone,
    Disk,
    EipAddress
} from "../../shared";

@Component({
    selector: "app-ecs",
    templateUrl: "./ecs.component.html",
    styleUrls: ["./ecs.component.scss"],
    animations: [routerTransition()]
})
export class EcsComponent implements OnInit {
    loading: boolean = false;
    scope: {
        Instances: Array<Instance>;
        Regions: Array<Region>;
        InstanceTypes: Array<InstanceType>;
        InstanceChargeTypes: Array<InstanceChargeType>;
        EipAddresses: Array<EipAddress>;
    };

    closeResult: string;

    constructor(private api: ApifetchService) {
        this.scopeInit();
    }

    scopeInit() {
        this.scope = {
            Instances: [],
            Regions: [],
            InstanceTypes: [],
            InstanceChargeTypes: [],
            EipAddresses: []
        };
    }

    ngOnInit() {
        this.dataBind();
    }

    dataBind() {
        this.loading = true;
        this.api.v1EcsList((err, res) => {
            if (err) return console.info(err);
            this.scope = res;
            this.scope.Instances.forEach(instance => {
                instance.IsEip = instance.EipAddress.IpAddress !== "";
                instance.HasPublicIp =
                    instance.EipAddress.IpAddress !== "" ||
                    instance.PublicIpAddress.IpAddress.length > 0;
            });
            this.scope.InstanceChargeTypes = [
                {
                    Id: "PrePaid",
                    LocalName: "包年包月"
                },
                {
                    Id: "PostPaid",
                    LocalName: "按量付费"
                }
            ];
            this.scope.Regions.forEach(region => {
                if (region.RegionData.Disks.length > 0) {
                    region.RegionData.Disks.forEach(disk => {
                        this.scope.Instances.forEach(instance => {
                            if (disk.InstanceId === instance.InstanceId) {
                                if (!instance.Disks) instance.Disks = [];
                                instance.Disks.push(disk);
                            }
                        });
                    });
                }
            });
            this.loading = false;
            // console.info(this.scope);
        });
    }

    getRegionEips(instance: Instance): Array<EipAddress> {
        return this.scope.EipAddresses.filter(eip => {
            return (
                eip.RegionId === instance.RegionId &&
                eip.InstanceId === "" &&
                eip.Status === "Available"
            );
        });
    }

    doBindEip(eip: EipAddress, instance: Instance): void {
        this.api.bindEip(
            { InstanceId: instance.InstanceId, AllocationId: eip.AllocationId },
            (err, res) => {
                if (res.RequestId) {
                    this.scope.Instances.find(ins => {
                        return ins.InstanceId === instance.InstanceId;
                    }).EipAddress = eip;
                    alert("绑定成功，请等待后台数据刷新（约1分钟）");
                }
            }
        );
    }

    public getLocalInfo(instance: Instance): Zone {
        if (!this.scope.Regions || this.scope.Regions.length === 0)
            return new Zone();
        const region = this.scope.Regions.find(e => {
            return e.RegionId === instance.RegionId;
        });
        const zone = region.RegionData.Zones.find(z => {
            return z.ZoneId === instance.ZoneId;
        });

        return zone;
    }

    public getImageInfo(instance: Instance): string {
        if (!this.scope.Regions || !instance) return "";
        const region = this.scope.Regions.find(e => {
            return e.RegionId === instance.RegionId;
        });
        const image = region.RegionData.Images.find(img => {
            return img.ImageId === instance.ImageId;
        });

        return `${image.OSName}`;
    }

    public getInstanceTypeInfo(instance: Instance): string {
        if (!this.scope.InstanceTypes || this.scope.InstanceTypes.length === 0)
            return "";
        const InstanceType = this.scope.InstanceTypes.find(e => {
            return e.InstanceTypeId === instance.InstanceType;
        });

        return `${InstanceType.InstanceTypeId} (C:${
            InstanceType.CpuCoreCount
        },M:${InstanceType.MemorySize}G)`;
    }

    public getInstanceChargeTypeInfo(instance: Instance): string {
        if (
            !this.scope.InstanceChargeTypes ||
            this.scope.InstanceChargeTypes.length === 0
        )
            return "";
        const InstanceChargeType = this.scope.InstanceChargeTypes.find(e => {
            return e.Id === instance.InstanceChargeType;
        });
        return InstanceChargeType.LocalName;
    }

    public getInternetChargeTypeInfo(instance: Instance): string {
        if (!instance) return "";

        return instance.InternatChargeType === "PayByBandwidth"
            ? "按带宽计费"
            : "按流量计费";
    }

    public getStatusObject(instance: Instance) {
        let obj = { css: "", desc: "", icon: "" };
        if (!instance || !instance.Status) return obj;
        switch (instance.Status) {
            case "Running":
                obj.css = "text-success";
                obj.desc = "运行中";
                obj.icon = "fa-play";
                break;
            case "Starting":
                obj.desc = "启动中";
                obj.css = "text-warning";
                obj.icon = "fa-pause";
                break;
            case "Stopping":
                obj.desc = "停止中";
                obj.css = "text-warning";
                obj.icon = "fa-pause";
                break;
            case "Stopped":
                obj.desc = "已停止";
                obj.css = "text-danger";
                obj.icon = "fa-stop";
                break;
        }
        return obj;
    }

    public getStatusClass(instance: Instance): string {
        return this.getStatusObject(instance).css;
    }

    public getStatusDesc(instance: Instance): string {
        return this.getStatusObject(instance).desc;
    }

    public getStatusIcon(instance: Instance): string {
        return this.getStatusObject(instance).icon;
    }

    public getExpireWarning(instance: Instance): string {
        if (instance.InstanceChargeType === "PostPaid") return "";
        const timeSpan = Math.ceil(
            (new Date(instance.ExpiredTime).getTime() - new Date().getTime()) /
                (86400 * 1000)
        );
        // console.info(timeSpan);
        return timeSpan < 15 ? "text-danger" : "";
    }

    startECS(id) {}
    stopECS(id) {}
    rebootECS(id) {}
    deleteECS(id) {}
}
