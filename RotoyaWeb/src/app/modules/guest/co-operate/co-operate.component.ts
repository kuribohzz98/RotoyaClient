import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { map, takeUntil, mergeMap, filter } from 'rxjs/operators';
import { AddressService } from './../../../shared/service/address.service';
import { ICity, City } from './../../../shared/models/address';
import { RequestCoOperateService } from './../../../service/request-co-operate.service';
import { NotifyService } from './../../../shared/service/notify.service';

@Component({
    selector: 'app-co-operate',
    templateUrl: './co-operate.component.html',
    styleUrls: ['./co-operate.component.scss']
})
export class CoOperateComponent implements OnInit, OnDestroy {

    formCoOperate: FormGroup;
    cities: ICity[] = [] as ICity[];
    districts: ICity[] = [] as ICity[];
    wards: ICity[] = [] as ICity[];

    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly addressService: AddressService,
        private readonly requestCoOperateService: RequestCoOperateService,
        private readonly notifyService: NotifyService
    ) { }

    ngOnInit(): void {
        this.formCoOperate = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            city: ['', Validators.required],
            district: ['', Validators.required],
            commune: ['', Validators.required],
            address: [''],
            phone: ['', Validators.required],
            email: ['', Validators.required]
        })

        this.initAddressCity();
        this.watchValueFormChange();
    }

    initAddressCity(): void {
        this.addressService.getCity()
            .pipe(map(res => res.map(data => new City(data)))).subscribe(data => {
                this.cities = data;
            });
    }

    watchValueFormChange(): void {
        this.formCoOperate.get('city').valueChanges
            .pipe(
                mergeMap(value => {
                    this.districts = [];
                    this.wards = [];
                    if (value) return this.addressService.getDistrict(+value);
                    return of(null);
                }),
                filter(value => !!value),
                map(value => value.map(data => new City(data))),
                takeUntil(this._destroy$)
            ).subscribe(value => {
                this.districts = value;
                this.formCoOperate.patchValue({
                    district: '',
                    commune: ''
                })
            })

        this.formCoOperate.get('district').valueChanges
            .pipe(
                mergeMap(value => {
                    this.wards = [];
                    if (value) return this.addressService.getWard(+value);
                    return of(null);
                }),
                filter(value => !!value),
                map(value => value.map(data => new City(data))),
                takeUntil(this._destroy$)
            ).subscribe(value => {
                this.wards = value;
                this.formCoOperate.patchValue({
                    commune: ''
                })
            })
    }

    onSubmit(): void {
        if (this.formCoOperate.invalid) return;
        const body = { ...this.formCoOperate.value };
        body.city = this.cities.find(city => city.id == this.formCoOperate.value.city)?.name;
        body.district = this.districts.find(district => district.id == this.formCoOperate.value.district)?.name;
        body.commune = this.wards.find(wards => wards.id == this.formCoOperate.value.commune)?.name;
        this.requestCoOperateService.post(body)
            .subscribe(res => {
                if (res.message == "success") {
                    this.notifyService.showNotifySuccess(`Yêu cầu của bạn đã được gửi thành công.
                    Chúng tôi sẽ liên hệ với bạn qua email hoặc số điện thoại sớm nhất có thể`);
                    this.router.navigate(['']);
                }
            })
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}