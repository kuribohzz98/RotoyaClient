import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import * as Mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from './../../../../../environments/environment.prod';
import { ISport } from './../../../../shared/models/sport';
import { ICity } from './../../../../shared/models/address';
import { AddressService } from './../../../../shared/service/address.service';
import { SportService } from './../../../../service/sport.service';
import { SportCenterService } from './../../../../service/sport-center.service';
import { converTimeToNumber } from '../../../../helper/util/time';
import { StorageService } from '../../../../shared/service/storage.service';
import { KeySessionStorage } from '../../../../constants/storage.constants';
import { ISportCenterFull } from './../../../../shared/models/sport-center';
import { NotifyService } from './../../../../shared/service/notify.service';
import { AdminLayoutService } from './../../../../shared/service/admin-layout.service';
import { UploadFileService } from './../../../../shared/service/file-upload.service';

@Component({
    selector: 'app-sport-center-create',
    templateUrl: './sport-center-create.component.html',
    styles: [`
        .field {margin-bottom: 20px;}
        #map { width: 100%; height: 600px; margin: 0px; }
        .load-image {display: none;}
    `]
})
export class SportCenterCreateComponent implements OnInit, OnDestroy, AfterViewInit {

    formStep1: FormGroup;
    formStep2: FormGroup;
    cities: ICity[] = [] as ICity[];
    districts: ICity[] = [] as ICity[];
    wards: ICity[] = [] as ICity[];
    sports: ISport[];

    map: Mapboxgl.Map;
    marker: Mapboxgl.Marker;
    latitude: number;
    longitude: number;

    latMouseMove: number;
    lonMouseMove: number;

    fileUpload: File;
    avatarUpload: string;
    isLoadImage: boolean = false;

    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly addressService: AddressService,
        private readonly sportService: SportService,
        private readonly sportCenterService: SportCenterService,
        private readonly storageService: StorageService,
        private readonly notifyService: NotifyService,
        private readonly adminLayoutService: AdminLayoutService,
        private readonly uploadFileService: UploadFileService
    ) { }

    ngOnInit(): void {
        this.sportService.get().subscribe((sports: ISport[]) => {
            this.sports = sports;
        })
        this.initForm();
        this.initPackageAddress();
    }

    ngAfterViewInit(): void {
        this.initMap(this.longitude, this.latitude);
    }

    initForm(): void {
        this.formStep1 = this.fb.group({
            name: ['', Validators.required],
            city: ['', Validators.required],
            district: ['', Validators.required],
            commune: ['', Validators.required],
            address: ['']
        })

        this.formStep2 = this.fb.group({
            timeOpen: ['', Validators.required],
            timeClose: ['', Validators.required],
            sports: ['', Validators.required]
        })
    }

    initPackageAddress(): void {
        const subjectChange$ = this.addressService.initPackage(
            this.formStep1,
            this._destroy$
        );

        subjectChange$.pipe(takeUntil(this._destroy$)).subscribe(data => {
            if (data.cities) this.cities = data.cities;
            if (data.districts) this.districts = data.districts;
            if (data.wards) this.wards = data.wards;
        })
    }

    initMap(longitude: number, latitude: number) {
        const lon = longitude || 106.342169;
        const lat = latitude || 17.707900;

        this.createMap(lon, lat)
            .addControl(this.addGeoCoder())
            .addControl(this.addFullScreenControl())
            .addControl(this.addNavigationControl());

        this.watchMapMouseMove();
    }

    createMap(longitude: number, latitude: number) {
        if (this.map) this.map.remove();
        this.map = new Mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 4,
            accessToken: environment.mapboxKey
        })
        return this.map;
    }

    addFullScreenControl(): Mapboxgl.FullscreenControl {
        if (this.map) return new Mapboxgl.FullscreenControl();
    }

    addNavigationControl(): Mapboxgl.NavigationControl {
        if (this.map) return new Mapboxgl.NavigationControl();
    }

    addGeoCoder() {
        if (this.map) return new MapboxGeocoder({
            accessToken: environment.mapboxKey,
            mapboxgl: Mapboxgl
        })

    }

    addMarker(longitude: number, latitude: number, draggable?: boolean) {
        if (this.marker) this.marker.remove();
        if (this.map) {
            const marker = draggable ? new Mapboxgl.Marker({ draggable: true }) : new Mapboxgl.Marker();
            marker.setLngLat([longitude, latitude]).addTo(this.map);
            draggable && marker.on('dragend', this.onDragEnd.bind(this));
            return marker;
        }
    }

    onDragEnd(): void {
        if (!this.marker) return;
        const { lng, lat } = this.marker.getLngLat();
        this.latitude = lat;
        this.longitude = lng;
    }

    watchMapMouseMove(): void {
        this.map.on('mousemove', e => {
            this.latMouseMove = e.lngLat.lat;
            this.lonMouseMove = e.lngLat.lng;
        });
    }

    mapPutMaker(): void {
        this.latitude = this.latMouseMove;
        this.longitude = this.lonMouseMove;
        this.marker = this.addMarker(this.longitude, this.latitude, true);
    }

    watchFileData($event: File): void {
        this.fileUpload = $event;
    }

    onFileComplete(data: any): void {
        if (data.success) {
            this.avatarUpload = data.link;
        } else {
            this.notifyService.showNotifyDanger(data.message);
        }
        this.isLoadImage = true;
    }

    onLoadImage(): void {
        this.isLoadImage = false;
    }

    onSubmit(): void {
        if (this.formStep1.invalid || this.formStep2.invalid || !this.latitude || !this.longitude) return;
        const sportCenterData = {} as ISportCenterFull;
        sportCenterData.name = this.formStep1.value.name;
        sportCenterData.city = this.cities.find(city => city.id == +this.formStep1.value.city).name;
        sportCenterData.district = this.districts.find(district => district.id == +this.formStep1.value.district).name;
        sportCenterData.commune = this.wards.find(ward => ward.id == +this.formStep1.value.commune).name;
        sportCenterData.address = this.formStep1.value.address;
        sportCenterData.timeOpen = converTimeToNumber(this.formStep2.value.timeOpen);
        sportCenterData.timeClose = converTimeToNumber(this.formStep2.value.timeClose);
        sportCenterData.latitude = this.latitude;
        sportCenterData.longitude = this.longitude;
        sportCenterData.sports = this.formStep2.value.sports;
        sportCenterData.userId = +this.storageService.getItemSession(KeySessionStorage.userId);
        (this.fileUpload ? this.uploadFileService.upload(this.fileUpload) : of(null))
            .pipe(
                mergeMap(res => {
                    if (res && res.filename) sportCenterData.avatar = res.filename;
                    return this.sportCenterService.post(sportCenterData);
                })
            ).subscribe(res => {
                if (res.message == 'success') {
                    this.notifyService.showNotifySuccess('Bạn đã tạo trung tâm thành công');
                    this.adminLayoutService.sportCenterSubject$.next(null);
                    this.adminLayoutService.sportCenterSelectedSubject$.next(null)
                    this.router.navigate(['/manager']);
                    return;
                }
                this.notifyService.showNotifyDanger('Yêu cầu tạo thất bại. Vui lòng kiểm tra lại');
            })
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}