import { Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { AuthServerProvider } from './../../../auth/auth-jwt.service';
import { NotifyService } from './../../../shared/service/notify.service';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

    email: FormControl;

    constructor(
        private readonly authServerProvider: AuthServerProvider,
        private readonly notifyService: NotifyService,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        this.email = new FormControl('', [Validators.required, Validators.email]);
    }

    getErrorMessage(): string {
        if (this.email.hasError('required')) {
            return 'Bạn không được để trống trường này';
        }

        return this.email.hasError('email') ? 'Email không đúng' : '';
    }

    onSubmit(): void {
        if (this.email.invalid) return;
        this.authServerProvider.forgetPassword(this.email.value)
            .subscribe(res => {
                if (res.message = 'success') {
                    this.notifyService.showNotifySuccess('Mật khẩu mới đã được gửi đến email');
                    this.router.navigate(['/login']);
                    return;
                }
            }, error => {
                this.notifyService.showNotifyDanger(error.error.error);
            })
    }
}