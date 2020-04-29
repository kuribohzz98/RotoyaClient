import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifyService } from './../../../shared/service/notify.service';
import { AuthServerProvider } from './../../../auth/auth-jwt.service';
import { AccountService } from './../../../auth/account.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    changePassForm: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly notifyService: NotifyService,
        private readonly authServerProvider: AuthServerProvider,
        private readonly accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.changePassForm = this.fb.group({
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        })
    }

    comparePassword(): boolean {
        return this.changePassForm.value.password == this.changePassForm.value.confirmPassword;
    }

    onSubmit(): void {
        if (this.changePassForm.invalid) return;
        if (!this.comparePassword()) {
            this.notifyService.showNotifyDanger('Mật khẩu nhập lại không khớp');
            return;
        }
        this.authServerProvider.changePassword({
            username: this.accountService.userIdentity.username,
            password: this.changePassForm.value.password
        }).subscribe(res => {
            this.notifyService.showNotifySuccess('Bạn đã đổi mật khẩu thành công');
            this.router.navigate(['/manager']);
        }, error => {
            this.notifyService.showNotifyDanger(error);
        })
    }
}