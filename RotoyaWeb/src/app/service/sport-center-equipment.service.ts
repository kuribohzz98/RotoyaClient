import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ISportCenterEquipment, ISportCenterEquipmentQuery } from './../shared/models/sport-center-equipment';

@Injectable({ providedIn: 'root' })
export class SportCenterEquipmentService extends BaseService<ISportCenterEquipment, ISportCenterEquipmentQuery> {
    path_url: string = '/sport-center-equipment';
    
}