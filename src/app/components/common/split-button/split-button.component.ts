import {Component, Input} from '@angular/core';
import {Action} from "../../../util/action";
import { Router, RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-split-button',
    templateUrl: './split-button.component.html',
    styleUrls: ['./split-button.component.scss'],
    imports: [NgClass, RouterLink]
})
export class SplitButtonComponent {
  @Input() actions: Action[] = [];
  @Input({ required: true }) width!: string;
  isOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  executeAction(action: Action) {
    if (action.callback) {
      action.callback();
    }
    if (action.routerLink) {
      this.router.navigate(action.routerLink);
    }
    this.isOpen = false;
  }
}
