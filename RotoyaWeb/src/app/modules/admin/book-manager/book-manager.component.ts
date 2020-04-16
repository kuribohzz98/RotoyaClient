import { SportCenterFull } from './../../../shared/models/sport-center';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { AdminLayoutService } from './../../../shared/service/admin-layout.service';
import { SportService } from './../../../service/sport.service';
import { getDateDDMM } from 'src/app/helper/util/date';

@Component({
  selector: 'app-book-manager',
  templateUrl: './book-manager.component.html'
})
export class BookManagerComponent implements OnInit, OnDestroy {
  sportCenter: SportCenterFull;
  dateSelected: string;
  listDate: string[] = [];

  private _destroy$: Subject<boolean> = new Subject();

  constructor(
    private readonly sportService: SportService,
    private readonly adminLayoutService: AdminLayoutService
  ) { }

  ngOnInit(): void {
    this.dateSelected = getDateDDMM(new Date());
    this.initListDate();
    this.adminLayoutService.sportCenterSelected.id &&
      this.sportService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, new Date().getTime())
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
        mergeMap(() => this.sportService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, new Date().getTime())),
        takeUntil(this._destroy$)
      ).subscribe(sportCenter => {
        this.sportCenter = sportCenter;
      })
  }

  compareDate(date: string) {
    return getDateDDMM(date) == this.dateSelected;
  }

  reloadData() {
    this.sportService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, new Date().getTime())
      .subscribe(sportCenter => this.sportCenter = sportCenter);
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

}
