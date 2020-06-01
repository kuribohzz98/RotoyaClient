import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IRequestCoOperate, IRequestCoOperateQuery } from './../shared/models/request-co-operate';

@Injectable({ providedIn: 'root' })
export class RequestCoOperateService
    extends BaseService<IRequestCoOperate, IRequestCoOperateQuery> {
    path_url: string = '/request-co-operate';


}