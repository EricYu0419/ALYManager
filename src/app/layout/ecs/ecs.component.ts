import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-ecs',
  templateUrl: './ecs.component.html',
  styleUrls: ['./ecs.component.scss'],
  animations: [routerTransition()]
})
export class EcsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
