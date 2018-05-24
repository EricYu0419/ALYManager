import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpParams,
    HTTP_INTERCEPTORS,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import { ConstConfig } from "../../common";
import { UserToken } from "../../auth";
import { of, throwError } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, retry, catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class ApifetchService {
    baseUri: string;
    headers: HttpHeaders;
    params: HttpParams;

    constructor(public http: HttpClient, private router: Router) {
        this.baseUri = "";
        if (ConstConfig.proxy) {
            this.baseUri = `${ConstConfig.proxy}/${ConstConfig.apiVersion}${
                this.baseUri
            }`;
        } else {
            this.baseUri = `/${ConstConfig.apiVersion}${this.baseUri}`;
        }
        this.headers = new HttpHeaders();
    }

    Test() {
        ajax("http://baidu.com").pipe(
            retry(3),
            map(res => {
                if (!res.response) {
                    throw new Error("Value expected");
                }
                return res.response;
            }),
            catchError(err => of([]))
        );
    }

    Auth(email: string, pass: string, rememberme: boolean, cb) {
        let url = this.baseUri + "/auth";
        return this.http
            .post(url, { email: email, pass: pass, rememberme: rememberme })
            .subscribe(
                (res: UserToken) => {
                    console.info(res);
                    localStorage.setItem("username", res.username);
                    localStorage.setItem("role", res.role);
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("tokenExpireAt", res.expiresAt);
                    cb(true);
                },
                error => {
                    console.error(error);
                    cb(false);
                }
            );
    }

    checkToken() {
        const expireAt = localStorage.getItem("tokenExpireAt");
        const token = localStorage.getItem("token");
        // console.info(new Date(expireAt) < new Date(),token);
        if (!expireAt || new Date(expireAt) < new Date() || !token) {
            this.router.navigate(["/login"]);
            return false;
        }
        this.headers = new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem("token")}`
        });
        return true;
    }

    v1PingList(cb) {
        return this.do("/client/pingList", null, cb);
    }

    v1EcsList(cb) {
        let url = `${this.baseUri}/client/ecslist`;
        return this.request({ method: "GET", url: url }, cb);
    }

    v1EssList(cb) {
        return this.do("/client/essList", null, cb);
    }
    v1EipList(cb) {
        return this.do("/client/eipList", null, cb);
    }

    v1Tasks(action) {
        return this.do(`/client/tasks/${action}`, null, (err, res) => {
            console.info(res);
        });
    }

    do(uri, obj, cb) {
        let url = this.plusParams(uri, obj);
        return this.request({ method: "GET", url: url }, cb);
    }

    stopECS(obj, cb) {
        return this.do("/ecs/stopInstance", obj, cb);
    }

    startECS(obj, cb) {
        return this.do("/ecs/startInstance", obj, cb);
    }

    rebootECS(obj, cb) {
        return this.do("/ecs/rebootInstance", obj, cb);
    }

    deleteECS(obj, cb) {
        return this.do("/ecs/deleteInstance", obj, cb);
    }

    renewECS(obj, cb) {
        return this.do("/ecs/renewInstance", obj, cb);
    }

    monitorECS(obj, cb) {
        return this.do("/ecs/describeInstanceMonitorData", obj, cb);
    }

    bindEip(obj, cb) {
        return this.do("/ecs/associateEipAddress", obj, cb);
    }

    plusParams(url, obj) {
        url = `${this.baseUri}${url}`;

        if (obj) {
            Object.keys(obj).forEach(k => {
                url += (url.indexOf("?") > -1 ? "&" : "?") + k + "=" + obj[k];
            });
        }
        return url;
    }

    private request<T>(opts, cb) {
        if (this.checkToken()) {
            try {
                this.http
                    .request(
                        new HttpRequest<T>(opts.method, opts.url, {
                            headers: this.headers
                        })
                    )
                    .subscribe(
                        (res: HttpResponse<T>) => {
                            if (res.status === 200) {
                                cb(null, res.body);
                            }
                        },
                        error => {
                            cb(error);
                        }
                    );
            } catch {
                cb("Unauthorized");
                window.location.href = "/Login";
            }
        }
    }
}
