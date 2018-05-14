import { Component, OnInit, Input, isDevMode } from "@angular/core";
import { Router } from "@angular/router";
import { routerTransition } from "../router.animations";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConstConfig } from "../common";
import { UserToken } from "./auth";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    email: string;
    pass: string;
    remeberme: boolean = false;
    constructor(public router: Router, public http: HttpClient) {}

    ngOnInit() {}

    onLoggedin() {
        let url = "/auth";
        if (ConstConfig.proxy) {
            url = `${ConstConfig.proxy}/${ConstConfig.apiVersion}${url}`;
        } else {
            url = `/${ConstConfig.apiVersion}${url}`;
        }
        console.info(url);

        let options = {};
        
        if (this.email && this.pass) {
            let params = new HttpParams();
            params.set("email", this.email);
            params.set("pass", this.pass);
            params.set("remeberme", this.remeberme.toString());
            options = { params: params };
        }
        
        this.http.post(url, {email:this.email,pass:this.pass,remeberme:this.remeberme}, options).subscribe(
            (res: UserToken) => {
                console.info(res);
                localStorage.setItem('username',res.username);
                localStorage.setItem('role',res.role);
                localStorage.setItem('token',res.token);
            },
            error => {
                console.error(error);
            }
        );
        // localStorage.setItem("isLoggedin", "true");
    }
}
