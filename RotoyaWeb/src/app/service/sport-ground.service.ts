import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ISportGround, ISportGroundQuery } from './../shared/models/sport-ground';

@Injectable({ providedIn: 'root' })
export class SportGroundService extends BaseService<ISportGround, ISportGroundQuery> {
    path_url: string = '/sport-ground';
    
    
}