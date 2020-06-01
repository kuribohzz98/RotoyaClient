import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, of, Subject, ReplaySubject } from 'rxjs';
import { map, mergeMap, filter, takeUntil } from 'rxjs/operators';
import { ICity, City } from './../models/address';

@Injectable({ providedIn: 'root' })
export class AddressService {
  resourceUrl: string = 'https://dc.tintoc.net/app/api-customer/public';
  constructor(private http: HttpClient) { }

  public getCity(): Observable<ICity[]> {
    return this.http.get<ICity[]>(this.resourceUrl + '/provinces', { params: { page: '0', size: '100', sort: 'name' } });
  }

  public getDistrict(cityId: number): Observable<ICity[]> {
    return this.http.get<ICity[]>(this.resourceUrl + '/districts', { params: { page: '0', size: '1000', ['provinceId.equals']: cityId.toString() } });
  }

  public getWard(districtId: number): Observable<ICity[]> {
    return this.http.get<ICity[]>(this.resourceUrl + '/wards/', { params: { page: '0', size: '1000', ['districtId.equals']: districtId.toString() } });
  }

  public initPackage(
    formControl: FormGroup,
    destroys$: Subject<boolean>
  ) {
    const subjectChange$ = new ReplaySubject<any>(1);
    this.initAddressCity(subjectChange$);
    this.watchValueFormChange(subjectChange$, formControl, destroys$);
    return subjectChange$;
  }

  private initAddressCity(subjectChange$: ReplaySubject<any>): void {
    this.getCity().pipe(
      map(res => res.map(data => new City(data)))
    )
      .subscribe(data => {
        subjectChange$.next({ cities: data });
      });
  }

  private watchValueFormChange(
    subjectChange$: ReplaySubject<any>,
    formControl: FormGroup,
    destroys$: Subject<boolean>
  ): void {
    formControl.get('city').valueChanges
      .pipe(
        mergeMap(value => {
          subjectChange$.next({
            districts: [],
            wards: []
          });
          if (value) return this.getDistrict(+value);
          return of(null);
        }),
        filter(value => !!value),
        map(value => value.map(data => new City(data))),
        takeUntil(destroys$)
      ).subscribe(value => {
        formControl.patchValue({
          district: '',
          commune: ''
        })
        subjectChange$.next({ districts: value });
      })

    formControl.get('district').valueChanges
      .pipe(
        mergeMap(value => {
          subjectChange$.next({ wards: [] });
          if (value) return this.getWard(+value);
          return of(null);
        }),
        filter(value => !!value),
        map(value => value.map(data => new City(data))),
        takeUntil(destroys$)
      ).subscribe(value => {
        formControl.patchValue({
          commune: ''
        })
        subjectChange$.next({ wards: value });
      })
  }
}
