import { Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { PaymentService } from './../../../../service/payment.service';
import { IPayment } from './../../../../shared/models/payment';

@Component({
    selector: 'app-payment-info',
    templateUrl: './payment-info.component.html'
})
export class PaymentInfoComponent implements OnInit {
    payment: any;
    hasEquipment: boolean = false;

    constructor(
        private readonly paymentService: PaymentService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        const orderId = this.router.url.split('/').pop();
        this.paymentService.getOneByOrderId(orderId).subscribe((payment: any) => {
            this.payment = payment;
            console.log(payment);
            this.hasEquipment = payment.bookings.some(booking => !!booking.sportCenterEquipmentBookings && !!booking.sportCenterEquipmentBookings.length);
        })
    }
}