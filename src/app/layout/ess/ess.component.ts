import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import {
    ApifetchService,
    Instance,
    Region,
    InstanceType,
    InstanceChargeType,
    Zone,
    Image,
    Disk,
    ScalingGroup,
    ScalingConfiguration,
    ScalingRule
} from "../../shared";
import { SnotifyService } from "ng-snotify";
@Component({
    selector: "app-ess",
    templateUrl: "./ess.component.html",
    styleUrls: ["./ess.component.scss"],
    animations: [routerTransition()]
})
export class EssComponent implements OnInit {
    scope: {
        Regions: Array<Region>;
        InstanceTypes: Array<InstanceType>;
        ScalingGroups: Array<ScalingGroup>;
        ScalingConfigurations: Array<ScalingConfiguration>;
        ScalingRules: Array<ScalingRule>;
    };
    loading: boolean = false;
    constructor(private api: ApifetchService, private snotify: SnotifyService) {
        this.scope = {
            ScalingGroups: [],
            Regions: [],
            InstanceTypes: [],
            ScalingConfigurations: [],
            ScalingRules: []
        };
    }

    ngOnInit() {
        this.dataBind();
    }

    dataBind() {
        this.api.v1EssList((err, res) => {
            this.scope = res;
            this.getActiveScalingConfiguration();
            this.getScalingRules();
        });
    }

    tabChange(e) {
        console.info(e);
    }

    getScalingGroup(groupId: string): ScalingGroup {
        if (
            !this.scope &&
            !this.scope.ScalingGroups &&
            this.scope.ScalingGroups.length === 0
        ) {
            return new ScalingGroup();
        }
        const scalingGroup = this.scope.ScalingGroups.find(group => {
            return group.ScalingGroupId === groupId;
        });
        return scalingGroup;
    }

    getRegionInfo(regionId: string): Region {
        let region = this.scope.Regions.find(region => {
            return region.RegionId === regionId;
        });
        return region;
    }

    doRule(rule: ScalingRule): void {
        let ruleId = rule.ScalingRuleId;
        this.api.do(
            "/ess/executeScalingRule",
            { ScalingRuleAri: rule.ScalingRuleAri },
            (err, res) => {
                if (res.RequestId) {
                    this.api.v1Tasks("InstanceStatusReflash");
                    this.api.v1Tasks("ScalingInstanceReflash");
                    this.api.v1Tasks("ScalingAllReflash");
                    this.snotify.success(
                        `伸缩规则【${
                            rule.ScalingRuleName
                        }】执行成功，活动编号：${res.ScalingActivityId}`
                    );
                } else {
                    this.snotify.error(res.message);
                }
            }
        );
    }

    public getLifecycleStateObject(group: ScalingGroup) {
        let obj = { css: "", desc: "", icon: "" };
        if (!group || !group.LifecycleState) return obj;
        switch (group.LifecycleState) {
            case "Active":
                obj.css = "text-success";
                obj.desc = "生效";
                obj.icon = "fa-play";
                break;
            case "Inactive":
                obj.desc = "失效";
                obj.css = "text-danger";
                obj.icon = "fa-stop";
                break;
            case "Deleting":
                obj.desc = "删除中";
                obj.css = "text-warning";
                obj.icon = "fa-pause";
        }
        return obj;
    }

    public getLifecycleStateClass(group: ScalingGroup): string {
        return this.getLifecycleStateObject(group).css;
    }

    public getLifecycleStateDesc(group: ScalingGroup): string {
        return this.getLifecycleStateObject(group).desc;
    }

    public getLifecycleStateIcon(group: ScalingGroup): string {
        return this.getLifecycleStateObject(group).icon;
    }

    public getInstanceTypeInfo(config: ScalingConfiguration): InstanceType {
        return this.scope.InstanceTypes.find(type => {
            return type.InstanceTypeId === config.InstanceType;
        });
    }

    public getInternetChargeTypeInfo(instance: Instance): string {
        if (!instance) return "";

        return instance.InternatChargeType === "PayByBandwidth"
            ? "按带宽计费"
            : "按流量计费";
    }

    public getDiskCategory(category: string): string {
        switch (category) {
            case "cloud":
                return "普通云盘";
            case "cloud_efficiency":
                return "高效云盘";
            case "cloud_ssd":
                return "SSD 盘";
            case "local_ssd_pro":
                return "I/O 密集型本地盘";
            case "local_hdd_pro":
                return "吞吐密集型本地盘";
            case "ephemeral":
                return "本地磁盘";
            case "ephemeral_ssd":
                return "本地 SSD 盘";
        }
    }

    getImageInfo(config: ScalingConfiguration): Image {
        return this.scope.Regions.find(region => {
            return (
                region.RegionId ===
                this.getScalingGroup(config.ScalingGroupId).RegionId
            );
        }).RegionData.Images.find(image => {
            return image.ImageId === config.ImageId;
        });
    }

    getActiveScalingConfiguration(): void {
        this.scope.ScalingGroups.forEach(group => {
            group.ActiveScalingConfiguration = this.scope.ScalingConfigurations.find(
                config => {
                    return (
                        group.ActiveScalingConfigurationId ===
                        config.ScalingConfigurationId
                    );
                }
            );
        });
    }
    getScalingRules(): void {
        this.scope.ScalingGroups.forEach(group => {
            if (!group.Rules) group.Rules = [];
            this.scope.ScalingRules.forEach(rule => {
                if (rule.ScalingGroupId === group.ScalingGroupId) {
                    group.Rules.push(rule);
                }
            });
        });
    }
}
