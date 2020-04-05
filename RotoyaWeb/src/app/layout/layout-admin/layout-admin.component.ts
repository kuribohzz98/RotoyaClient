import { NotifyService } from './../../helper/service/notify.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html'
})
export class LayoutAdminComponent {
  constructor(
    private readonly notifyService: NotifyService
  ) {

  }

  notify() {
    this.notifyService.showNotifySuccess("hihi");
  }
}
