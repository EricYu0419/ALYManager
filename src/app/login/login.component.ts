import { Component, OnInit, Input, isDevMode } from "@angular/core";
import { Router } from "@angular/router";
import { routerTransition } from "../router.animations";
import { ApifetchService } from "../shared";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    email: string;
    pass: string;
    rememberme: boolean = false;

    constructor(public router: Router, public fetchService: ApifetchService) {}

    ngOnInit() {}

    onLoggedin() {
        this.fetchService.Auth(this.email, this.pass, this.rememberme,function (isLogged){
            window.location.href = "/";
        });
    }
}
