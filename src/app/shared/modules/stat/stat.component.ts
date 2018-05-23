import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
    @Input() bgClass: string;
    @Input() icon: string;
    @Input() count: number;
    @Input() label: string;
    @Input() data: number;
    @Output() event: EventEmitter<any> = new EventEmitter();

    constructor(private translate: TranslateService) {
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
