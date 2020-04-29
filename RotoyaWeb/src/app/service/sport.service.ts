import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ISport, ISportQuery } from './../shared/models/sport';

@Injectable({ providedIn: 'root' })
export class SportService extends BaseService<ISport, ISportQuery> {
    path_url: string = '/sport';
    
    
}