import { Component, OnInit, Input } from "@angular/core";
import { Instance } from "../../../../shared";
import { ApifetchService } from "../../../../shared";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { routerTransition } from "../../../../router.animations";
import * as moment from "moment";

@Component({
    selector: "app-monitor-modal",
    templateUrl: "./monitor-modal.component.html",
    styleUrls: ["./monitor-modal.component.scss"],
    animations: [routerTransition()]
})
export class MonitorModalComponent implements OnInit {
    @Input() Instance: Instance;
    InstanceMonitorDatas: Array<Object>;
    search: {
        start: {
            date: {
                year: number;
                month: number;
                day: number;
            };
            time: {
                hour: number;
                minute: number;
                second: number;
            };
        };
        end: {
            date: {
                year: number;
                month: number;
                day: number;
            };
            time: {
                hour: number;
                minute: number;
                second: number;
            };
        };
        Period: string;
    };
    closeResult: string;
    lineArray: Array<any>;
    cpuLine: any;
    loading: boolean = false;
    constructor(private modalService: NgbModal, private api: ApifetchService) {}

    public setTime(date: Date) {
        return {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            time: {
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds()
            }
        };
    }

    public getTime(date: any): Date {
        return new Date(
            date.date.year,
            date.date.month - 1,
            date.date.day,
            date.time.hour,
            date.time.minute,
            date.time.second
        );
    }

    ngOnInit() {}

    open(content) {
        this.search = {
            start: this.setTime(
                new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    new Date().getHours() - 2,
                    new Date().getMinutes(),
                    0
                )
            ),
            end: this.setTime(
                new Date(
                    new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        new Date().getHours(),
                        new Date().getMinutes(),
                        0
                    )
                )
            ),
            Period: "60"
        };
        this.InstanceMonitorDatas = [];
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

    query() {
        this.loading = true;
        let queryInstanceParams = {
            InstanceId: this.Instance.InstanceId,
            Period: this.search.Period,
            StartTime: this.getTime(this.search.start)
                .toISOString()
                .replace(".000Z", "Z"),
            EndTime: this.getTime(this.search.end)
                .toISOString()
                .replace(".000Z", "Z")
        };
        this.lineArray = [];
        this.api.monitorECS(queryInstanceParams, (err, res) => {
            this.loading = false;
            this.InstanceMonitorDatas = res
                ? res.MonitorData.InstanceMonitorData
                : [];
            if (this.InstanceMonitorDatas.length > 0) {
                this.lineArray.push(
                    this.lineChartGenerate(this.InstanceMonitorDatas, "CPU")
                );
                this.lineArray.push(
                    this.lineChartGenerate(this.InstanceMonitorDatas, "NetRX")
                );
                this.lineArray.push(
                    this.lineChartGenerate(this.InstanceMonitorDatas, "NetTX")
                );
                this.lineArray.push(
                    this.lineChartGenerate(this.InstanceMonitorDatas, "BPS")
                );
                this.lineArray.push(
                    this.lineChartGenerate(this.InstanceMonitorDatas, "IOPS")
                );
            }
        });
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

    // lineChart

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    public lineChartGenerate(arr: Array<any>, type: string): any {
        let title = "";
        let labels = [];
        let calcFn;
        switch (type) {
            case "CPU":
                title = `${type}平均使用率(%)`;
                labels = [
                    {
                        label: title,
                        calcFn: function(a) {
                            return a.CPU;
                        }
                    }
                ];
                break;
            case "BPS":
                title = "系统磁盘BPS(Bps)";
                labels = [
                    {
                        label: "系统盘总读BPS(Bps)",
                        calcFn: function(a) {
                            return a.BPSRead;
                        }
                    },
                    {
                        label: "系统盘总写BPS(Bps)",
                        calcFn: function(a) {
                            return a.BPSWrite;
                        }
                    }
                ];
                break;
            case "NetRX":
                title = "网络流入带宽(bit/s)";
                labels = [
                    {
                        label: "公网流入带宽(bit/s)",
                        calcFn: function(a) {
                            return a.InternetRX;
                        }
                    },
                    {
                        label: "私网流入带宽(bit/s)",
                        calcFn: function(a) {
                            return a.IntranetRX;
                        }
                    }
                ];
                break;
            case "NetTX":
                title = "网络流出带宽(bit/s)";
                labels = [
                    {
                        label: "公网流出带宽(bit/s)",
                        calcFn: function(a) {
                            return a.InternetTX;
                        }
                    },
                    {
                        label: "私网流出带宽(bit/s)",
                        calcFn: function(a) {
                            return a.IntranetTX;
                        }
                    }
                ];
                break;
            case "IOPS":
                title = "系统盘IOPS(次/秒)";
                labels = [
                    {
                        label: "系统读IOPS(次/秒)",
                        calcFn: function(a) {
                            return a.IOPSRead;
                        }
                    },
                    {
                        label: "系统写IOPS(次/秒)",
                        calcFn: function(a) {
                            return a.IOPSWrite;
                        }
                    }
                ];
                break;
        }
        let lineChartObj = {
            options: {
                spanGaps: true,
                responsive: true,
                tooltips: {
                    mode: "index",
                    axis: "y"
                }
            },
            legend: true,
            title: title,
            type: "line",
            labels: [],
            data: [],
            color: [
                {
                    // grey
                    backgroundColor: "rgba(148,159,177,0.2)",
                    borderColor: "rgba(148,159,177,1)",
                    pointBackgroundColor: "rgba(148,159,177,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(148,159,177,0.8)"
                },
                {
                    // dark grey
                    backgroundColor: "rgba(77,83,96,0.2)",
                    borderColor: "rgba(77,83,96,1)",
                    pointBackgroundColor: "rgba(77,83,96,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(77,83,96,1)"
                }
            ]
        };
        labels.forEach(label => {
            lineChartObj.data.push({
                data: [],
                fill: false,
                label: label.label,
                calcFn: label.calcFn
            });
        });
        arr = arr.sort((a, b) => {
            return (
                new Date(a.TimeStamp).getTime() -
                new Date(b.TimeStamp).getTime()
            );
        });

        arr.forEach(a => {
            lineChartObj.labels.push(
                this.search.start.date.year === this.search.end.date.year &&
                this.search.start.date.month === this.search.end.date.month &&
                this.search.start.date.day === this.search.end.date.day
                    ? moment(new Date(a.TimeStamp)).format("HH:mm")
                    : moment(new Date(a.TimeStamp)).format("YYYY-MM-DD HH:mm")
            );
            lineChartObj.data.forEach(d => {
                d.data.push(d.calcFn(a));
            });
        });
        // console.info(lineChartObj);
        return lineChartObj;
    }
}
