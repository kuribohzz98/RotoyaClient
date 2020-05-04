import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpEventType, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { map, tap, last, catchError } from 'rxjs/operators';
import { UploadFileModel } from './../components/upload-file/upload-file.component';
import { environment } from './../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class UploadFileService {

    constructor(
        private readonly http: HttpClient
    ) { }

    public uploadServerTemp(file: UploadFileModel, param: string, target: string): Observable<string | HttpResponse<any>> {
        const fd = new FormData();
        fd.append(param, file.data);

        const req = new HttpRequest('POST', target, fd, {
            reportProgress: true
        });
        file.inProgress = true;
        return this.http.request(req).pipe(
            map(event => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        file.progress = Math.round(event.loaded * 100 / event.total);
                        break;
                    case HttpEventType.Response:
                        return event;
                }
            }),
            tap(message => { }),
            last(),
            catchError((error: HttpErrorResponse) => {
                file.inProgress = false;
                file.canRetry = true;
                return of(`${file.data.name} upload failed.`);
            })
        )
    }

    public upload(file: File): Observable<{ filename: string }> {
        const fd = new FormData();
        fd.append('file', file);
        return this.http.post<{ filename: string }>(environment.serverUrl + '/image', fd);
    }
}