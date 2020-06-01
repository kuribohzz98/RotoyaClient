import { IBooking } from './../shared/models/booking';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class BookService extends BaseService<IBooking> {
    path_url: string = '/booking';

}