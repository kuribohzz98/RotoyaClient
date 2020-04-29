import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { AdminLayoutService } from './../../../shared/service/admin-layout.service';
import { SportCenterService } from '../../../service/sport-center.service';
import { getDateDDMM } from '../../../helper/util/date';
import { ISportCenterFull } from './../../../shared/models/sport-center';

@Component({
  selector: 'app-book-manager',
  templateUrl: './book-manager.component.html'
})
export class BookManagerComponent implements OnInit, OnDestroy {
  sportCenter: ISportCenterFull;
  dateSelected: string;
  listDate: string[] = [];

  private _destroy$: Subject<boolean> = new Subject();

  constructor(
    private readonly sportCenterService: SportCenterService,
    private readonly adminLayoutService: AdminLayoutService
  ) { }

  ngOnInit(): void {
    this.dateSelected = getDateDDMM(new Date());
    this.initListDate();
    this.adminLayoutService.sportCenterSelected.id &&
      this.sportCenterService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, new Date().getTime())
        .subscribe(sportCenter => {
          this.sportCenter = sportCenter;
        })

    this.watchSportCenter();
  }

  initListDate() {
    for (let i = 0; i < 3; i++) {
      this.listDate = [...this.listDate, getDateDDMM(new Date().getTime() + 1000 * 60 * 60 * 24 * i)];
    }
  }

  watchSportCenter() {
    this.adminLayoutService.sportCenterSelectedSubject$
      .pipe(
        mergeMap(() => this.sportCenterService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, new Date().getTime())),
        takeUntil(this._destroy$)
      ).subscribe(sportCenter => {
        this.sportCenter = sportCenter;
      })
  }

  compareDate(date: string) {
    return getDateDDMM(date) == this.dateSelected;
  }

  reloadData() {
    this.sportCenterService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, new Date().getTime())
      .subscribe(sportCenter => this.sportCenter = sportCenter);
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

}
