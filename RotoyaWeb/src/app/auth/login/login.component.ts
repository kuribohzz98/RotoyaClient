import { OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServerProvider } from './../auth-jwt.service';
import { NotifyService } from './../../shared/service/notify.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginFrom: FormGroup;
    
    constructor(
        private readonly authServerProvider: AuthServerProvider,
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly notifyService: NotifyService
    ) { }

    ngOnInit(): void {
        this.loginFrom = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    onSubmit(): void {
        if(this.loginFrom.invalid) return;
        this.authServerProvider.login(this.loginFrom.value).subscribe(res => {
            if (res.isNew) return this.router.navigate(['/change-password']);
            this.notifyService.showNotifySuccess('Đăng nhập thành công');
            this.router.navigate(['/manager']);
        }, err => {
            console.log(err);
        })
    }
}