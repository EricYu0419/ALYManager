import { Component, OnInit, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "app-page-header",
    templateUrl: "./page-header.component.html",
    styleUrls: ["./page-header.component.scss"]
})
export class PageHeaderComponent implements OnInit {
    @Input() heading: string;
    @Input() icon: string;

    constructor(private translate: TranslateService) {
        console.info(translate);
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
        this.translate.use(
            browserLang.match(/en|fr|ur|es|it|fa|de|zh/) ? browserLang : "zh"
        );
    }

    ngOnInit() {}
}
