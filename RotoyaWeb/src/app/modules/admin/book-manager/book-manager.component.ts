import { FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { AdminLayoutService } from './../../../shared/service/admin-layout.service';
import { SportCenterService } from '../../../service/sport-center.service';
import { getDateDDMM } from '../../../helper/util/date';
import { ISportCenterFull } from './../../../shared/models/sport-center';
import { TimeSlotDialogData, TimeSlotDialogComponent } from './time-slot-dialog/time-slot-dialog.component';

interface TypeDateOption {
  name: string;
  value: number
}

@Component({
  selector: 'app-book-manager',
  templateUrl: './book-manager.component.html',
  styles: [`
    .primary-tooltip-info {
      cursor: pointer;
    }
    ::ng-deep .primary-tooltip {
      color: white !important;
    }
  `]
})
export class BookManagerComponent implements OnInit, OnDestroy {
  sportCenter: ISportCenterFull;
  listDate: TypeDateOption[] = [];
  dateControl: FormControl;

  private _destroy$: Subject<boolean> = new Subject();

  constructor(
    private readonly sportCenterService: SportCenterService,
    private readonly adminLayoutService: AdminLayoutService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initListDate();
    this.dateControl = new FormControl(this.listDate[0].value);
    console.log(this.listDate);
    this.adminLayoutService.sportCenterSelected.id && this.initSportCenter();
    this.watchSportCenter();
    this.dateControl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(value => {
        this.initSportCenter(value);
      })
  }

  initSportCenter(time?: number): void {
    this.sportCenterService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, time || new Date().getTime())
      .subscribe(sportCenter => {
        this.sportCenter = sportCenter;
      })
  }

  initListDate(): void {
    for (let i = 0; i < 3; i++) {
      const time = new Date().getTime() + 1000 * 60 * 60 * 24 * i;
      this.listDate = [...this.listDate, { name: getDateDDMM(time), value: time }];
    }
  }

  watchSportCenter(): void {
    this.adminLayoutService.sportCenterSelectedSubject$
      .pipe(
        mergeMap(() => this.sportCenterService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, new Date().getTime())),
        takeUntil(this._destroy$)
      ).subscribe(sportCenter => {
        this.sportCenter = sportCenter;
      })
  }

  compareDate(date: string): boolean {
    if (!date) return false;
    const dateSelected = this.listDate.find(_date => _date.name == getDateDDMM(date));
    if (!dateSelected) return false;
    return getDateDDMM(date) == dateSelected.name;
  }

  reloadData(): void {
    this.sportCenterService.getSportCenter(this.adminLayoutService.sportCenterSelected.id, new Date().getTime())
      .subscribe(sportCenter => this.sportCenter = sportCenter);
  }

  openInfo(timeSlotId: number): void {
    const data = {} as TimeSlotDialogData;
    data.id = timeSlotId || 5;
    data.time = this.dateControl.value || 1583712000000;
    const dialogRef = this.dialog.open(TimeSlotDialogComponent, {
      width: '1000px',
      data
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

}
