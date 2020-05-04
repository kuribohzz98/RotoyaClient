import { IPayment } from './../../../shared/models/payment';
import { Component, OnInit } from '@angular/core';
import { PaymentService } from './../../../service/payment.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {

    constructor(
        private readonly paymentService: PaymentService
    ) { }
    
    ngOnInit(): void {
        
    }

    initPayment() {
        const body = {} as IPayment
        this.paymentService.get({
            
        })
    }
}