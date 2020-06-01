import { KeyLocalStorage, KeySessionStorage } from './../../constants/storage.constants';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
    constructor() { }

    setItemLocal(key: KeyLocalStorage, value: string): void {
        localStorage.setItem(key, value);
    }

    setItemSession(key: KeySessionStorage, value: string): void {
        sessionStorage.setItem(key, value);
    }

    getItemLocal(key: KeyLocalStorage): string {
        return localStorage.getItem(key);
    }

    getItemSession(key: KeySessionStorage): string {
        return sessionStorage.getItem(key);
    }

    removeItemLocal(key: KeyLocalStorage): void {
        sessionStorage.removeItem(key);
    }

    removeItemSession(key: KeySessionStorage): void {
        sessionStorage.removeItem(key);
    }

}