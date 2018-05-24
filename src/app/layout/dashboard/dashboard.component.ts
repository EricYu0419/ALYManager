import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { ApifetchService, Region, Instance } from "../../shared";
@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    scope: {
        Regions: Array<Region>;
        Instances: Array<Instance>;
        PingInfos: Array<PingInfo>;
    };
    loading: boolean = false;
    constructor(private api: ApifetchService) {
        this.sliders.push(
            {
                imagePath: "assets/images/slider1.jpg",
                label: "First slide label",
                text:
                    "Nulla vitae elit libero, a pharetra augue mollis interdum."
            },
            {
                imagePath: "assets/images/slider2.jpg",
                label: "Second slide label",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                imagePath: "assets/images/slider3.jpg",
                label: "Third slide label",
                text:
                    "Praesent commodo cursus magna, vel scelerisque nisl consectetur."
            }
        );

        this.alerts.push(
            {
                id: 1,
                type: "success",
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            },
            {
                id: 2,
                type: "warning",
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            }
        );
    }

    ngOnInit() {
        this.dataBind();
    }

    scopeInit() {
        this.scope = {
            Regions: [],
            PingInfos: [],
            Instances: []
        };
    }
    dataBind() {
        this.scopeInit();
        this.loading = true;
        this.api.v1PingList((err, res) => {
            this.scope = res;
            this.loading = false;
        });
    }

    getRegionInfo(id: string): string {
        return this.scope.Regions.find(region => {
            return (
                region.RegionId ===
                this.scope.Instances.find(ins => {
                    return ins.InstanceId === id;
                }).RegionId
            );
        }).LocalName;
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}

export class PingInfo {
    InstanceId: string;
    IpAddress: string;
    InstanceName: string;
    pingInfo: {
        noIp: boolean;
        alive: boolean;
        output: string;
        avg: string;
        min: string;
        max: string;
        time: number;
    };
}
