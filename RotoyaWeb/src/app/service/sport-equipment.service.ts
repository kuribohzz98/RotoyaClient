import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ISportEquipment, ISportEquipmentQuery } from './../shared/models/sport-equipment';

@Injectable({ providedIn: 'root' })
export class SportEquipmentService extends BaseService<ISportEquipment, ISportEquipmentQuery> {
    path_url: string = '/sport-equipment';
    
    
}