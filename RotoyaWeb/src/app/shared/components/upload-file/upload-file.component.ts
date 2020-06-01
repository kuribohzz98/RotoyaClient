import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { UploadFileService } from './../../service/file-upload.service';

export class UploadFileModel {
    data: File;
    state: string;
    inProgress: boolean;
    progress: number;
    canRetry: boolean;
    canCancel: boolean;
    sub?: Subscription;
}

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
    animations: [
        trigger('fadeInOut', [
            state('in', style({ opacity: 100 })),
            transition('* => void', [
                animate(300, style({ opacity: 0 }))
            ])
        ])
    ]
})
export class UploadFileComponent implements OnInit {
    /** Link text */
    @Input() text = 'Tải lên';
    /** Name used in form which will be sent in HTTP request. */
    @Input() param = 'file';
    /** Target URL for file uploading. */
    @Input() target = 'https://file.io/?expires=1d';
    /** File extension that accepted, same as 'accept' of <input type="file" />. 
        By the default, it's set to 'image/*'. */
    @Input() accept = 'image/*';
    /** Allow you to add handler after its completion. Bubble up response text from remote. */
    @Output() complete: EventEmitter<string> = new EventEmitter<string>();

    @Output() fileData: EventEmitter<File> = new EventEmitter<File>();

    public files: Array<UploadFileModel> = [];

    constructor(
        private readonly uploadFileService: UploadFileService
    ) { }

    ngOnInit() {
    }

    onClick() {
        const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
        fileUpload.onchange = () => {
            for (let index = 0; index < fileUpload.files.length; index++) {
                const file = fileUpload.files[index];
                this.files.push({
                    data: file, state: 'in',
                    inProgress: false, progress: 0, canRetry: false, canCancel: true
                });
            }
            this.uploadFiles();
        };
        fileUpload.click();
    }

    cancelFile(file: UploadFileModel) {
        file.sub.unsubscribe();
        this.removeFileFromArray(file);
    }

    retryFile(file: UploadFileModel) {
        this.uploadFile(file);
        file.canRetry = false;
    }

    private uploadFile(file: UploadFileModel) {
        file.sub = this.uploadFileService
            .uploadServerTemp(file, this.param, this.target)
            .subscribe((event: any) => {
                if (typeof (event) === 'object') {
                    this.removeFileFromArray(file);
                    this.complete.emit(event.body);
                    this.fileData.emit(file.data);
                }
            })
    }

    private uploadFiles() {
        const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
        fileUpload.value = '';

        this.files.forEach(file => {
            this.uploadFile(file);
        });
    }

    private removeFileFromArray(file: UploadFileModel) {
        const index = this.files.indexOf(file);
        if (index > -1) {
            this.files.splice(index, 1);
        }
    }
}