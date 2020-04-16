import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from './../../../../../environments/environment.prod';
import { SportCenterComponentService } from './../sport-center-component.service';

@Component({
    selector: 'app-sport-center-map',
    templateUrl: './sport-center-map.component.html',
    styles: [`
        #map { width: 100%; height: 100%; margin: 0px; }
    `]
})
export class SportCenterMapComponent implements OnInit, OnDestroy {
    @Input('latitude') latitudeInput: number;
    @Input('longitude') longitudeInput: number;

    latitudeEdit: number;
    longitudeEdit: number;

    map: Mapboxgl.Map;
    marker: Mapboxgl.Marker;

    _destroy$: Subject<boolean> = new Subject();

    constructor(
        private readonly sportCenterComponentService: SportCenterComponentService
    ) {
    }

    ngOnInit() {
        // Mapboxgl.accessToken = environment.mapboxKey;
        this.initMap(this.longitudeInput, this.latitudeInput);
        this.wathEditMap();
    }

    wathEditMap() {
        this.sportCenterComponentService.mapSubject$
            .pipe(
                filter(data => !data || data.save || data.cancel || data.reload),
                takeUntil(this._destroy$)
            ).subscribe(data => {
                if (data && data.save) {
                    this.marker = this.addMarker(this.longitudeEdit, this.latitudeEdit);
                    this.sportCenterComponentService.mapSubject$.next({
                        latitude: this.latitudeEdit,
                        longitude: this.longitudeEdit
                    });
                    return;
                }
                if (data && data.cancel) {
                    this.marker = this.addMarker(this.longitudeInput, this.latitudeInput);
                    return;
                }
                if (data && data.reload) {
                    this.initMap(data.longitude, data.latitude);
                    return;
                }

                this.marker = this.addMarker(this.longitudeInput, this.latitudeInput, true);
            })
    }

    initMap(longitude: number, latitude: number) {
        this.longitudeEdit = longitude || 105.781554;
        this.latitudeEdit = latitude || 21.037674;

        this.createMap(this.longitudeEdit, this.latitudeEdit)
            .addControl(this.addFullScreenControl())
            .addControl(this.addNavigationControl());

        this.marker = this.addMarker(this.longitudeEdit, this.latitudeEdit);
    }

    createMap(longitude: number, latitude: number) {
        if (this.map) this.map.remove();
        this.map = new Mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 16,
            accessToken: environment.mapboxKey
        })
        return this.map;
    }

    addFullScreenControl() {
        if (this.map) return new Mapboxgl.FullscreenControl();
    }

    addNavigationControl() {
        if (this.map) return new Mapboxgl.NavigationControl();
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

    onDragEnd() {
        if (!this.marker) return;
        const { lng, lat } = this.marker.getLngLat();
        this.latitudeEdit = lat;
        this.longitudeEdit = lng;
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}