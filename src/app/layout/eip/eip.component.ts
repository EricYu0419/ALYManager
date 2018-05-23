import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import {
    ApifetchService,
    Instance,
    Region,
    InstanceType,
    EipAddress
} from "../../shared";

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

    constructor(private api: ApifetchService) {}

    ngOnInit() {
        this.dataBind();
    }

    dataBind() {
        this.loading = true;
        this.scopeInit();
        this.api.v1EipList((err, res) => {
            this.scope = res;
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

    releaseEIP(eip:EipAddress):void{
        this.api.do('/ecs/releaseEipAddress',{AllocationId:eip.AllocationId},(err,res)=>{
            if (res.RequestId) {
                this.api.v1Tasks('EipAddressesReflash');
                alert('释放成功，请等待数据刷新！');
            }
        })
    }
}
