import { Injectable } from "@angular/core";
import * as NotifyConstants from './../../constants/notify.constants';

declare var $: any;
@Injectable({ providedIn: 'root' })
export class NotifyService {

    private setOptions(
        type: NotifyConstants.NotifyType,
        icon?: string,
        placement?: {
            from: NotifyConstants.NotifyPositionFrom,
            align: NotifyConstants.NotifyPositionAlign
        }
    ) {
        return {
            type,
            timer: 1000,
            placement: {
                from: placement?.from || NotifyConstants.NotifyPositionFrom.Top,
                align: placement?.align || NotifyConstants.NotifyPositionAlign.Right
            },
            template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                '<i class="material-icons" data-notify="icon">' + `${icon ? icon : 'notifications'}` + '</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        }
    }

    public showNotify(
        message: string,
        type: NotifyConstants.NotifyType,
        icon?: string,
        placement?: {
            from: NotifyConstants.NotifyPositionFrom,
            align: NotifyConstants.NotifyPositionAlign
        }
    ) {
        $.notify({ message }, this.setOptions(type, icon, placement));
    }

    public showNotifySuccess(message: string) {
        this.showNotify(message, NotifyConstants.NotifyType.Success, 'notifications');
    }

    public showNotifyInfo(message: string) {
        this.showNotify(message, NotifyConstants.NotifyType.Info, 'info');
    }

    public showNotifyWarning(message: string) {
        this.showNotify(message, NotifyConstants.NotifyType.Warning, 'warning');
    }

    public showNotifyDanger(message: string) {
        this.showNotify(message, NotifyConstants.NotifyType.Danger, 'error');
    }

    public closeAll() {
        $.notifyClose();
    }
}