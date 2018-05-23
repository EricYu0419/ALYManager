import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        const expireAt = localStorage.getItem("tokenExpireAt");
        const token = localStorage.getItem("token");
        console.info(new Date(expireAt),new Date());
        if (expireAt && new Date(expireAt)>new Date() && token) {
            return true;
        }
        this.router.navigate(["/login"]);
        return false;
    }
}
