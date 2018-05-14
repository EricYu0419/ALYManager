import { Component, OnInit, Input } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
    username: string;
    role: string;
    pushRightClass: string = "push-right";

    constructor(private translate: TranslateService, public router: Router) {
        this.translate.addLangs([
            "en",
            "fr",
            "ur",
            "es",
            "it",
            "fa",
            "de",
            "zh"
        ]);
        this.translate.setDefaultLang("zh");
        const browserLang = this.translate.getBrowserLang();
        console.info(browserLang);
        this.translate.use(
            browserLang.match(/en|fr|ur|es|it|fa|de|zh/)
                ? browserLang
                : "zh"
        );

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.username = localStorage.getItem("username");
        this.role = localStorage.getItem("role");
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector("body");
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector("body");
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector("body");
        dom.classList.toggle("rtl");
    }

    onLoggedout() {
        localStorage.removeItem("isLoggedin");
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
