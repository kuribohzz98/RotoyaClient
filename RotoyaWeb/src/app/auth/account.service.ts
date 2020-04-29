import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';
import { IUser } from './../shared/models/user';
import { StorageService } from './../shared/service/storage.service';
import { KeySessionStorage } from '../constants/storage.constants';
import { BaseService } from '../service/base.service';

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseService {
  path_url: string = '/user';
  private _userIdentity: IUser | null = null;
  private authenticationState: ReplaySubject<IUser | null> = new ReplaySubject<IUser | null>(1);
  private accountCache$?: Observable<IUser | null>;

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly _http: HttpClient
  ) {
    super(_http);
  }

  authenticate(identity: IUser | null): void {
    this._userIdentity = identity;
    // this.authenticationState.next(this._userIdentity);
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this._userIdentity || !this._userIdentity.roles) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this._userIdentity.roles.some((role: string) => authorities.includes(role));
  }

  get userIdentity(): IUser | null {
    return this._userIdentity;
  }

  identity(force?: boolean): Observable<IUser | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      const idUser = this.storageService.getItemSession(KeySessionStorage.userId);
      if (!idUser) return of(null);
      if (this._userIdentity) return of(this._userIdentity);
      this.accountCache$ = this.fetch(+idUser).pipe(
        catchError(() => {
          return of(null);
        }),
        tap((account: IUser | null) => {
          this.authenticate(account);

          // if (account) {
          //   this.navigateToStoredUrl();
          // }
        }),
        // shareReplay()
      );
    }
    return this.accountCache$;
  }

  isAuthenticated(): boolean {
    return this._userIdentity !== null && !!this._userIdentity.roles.length;
  }

  isAdmin(): boolean {
    return this._userIdentity !== null && !!this._userIdentity.roles.length && this._userIdentity.roles.includes('ADMIN');
  }

  getAuthenticationState(): Observable<IUser | null> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.userIdentity ? this.userIdentity.userMeta.avatar : '';
  }

  private fetch(id: number): Observable<IUser> {
    return this._http.get<IUser>(this.url + `/${id}`);
  }

  // private navigateToStoredUrl(): void {
  //   // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
  //   // if login is successful, go to stored previousState and clear previousState
  //   const previousUrl = this.storageService.getItemSession(KeySessionStorage.previousUrl);
  //   if (previousUrl) {
  //     this.storageService.removeItemSession(KeySessionStorage.previousUrl);
  //     this.router.navigateByUrl(previousUrl);
  //   }
  // }
}
