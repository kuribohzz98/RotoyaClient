import { Injectable } from '@angular/core';
import { ISport, ISportQuery } from './../shared/models/sport';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class BookService extends BaseService<ISport, ISportQuery> {
    path_url: string = '/sport';

}