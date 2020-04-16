import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' }) 
export abstract class BaseService {
    abstract path_url: string;

    constructor(
        protected http: HttpClient
    ) { }
    
    get url() {
        return environment.serverUrl + this.path_url;
    }
}