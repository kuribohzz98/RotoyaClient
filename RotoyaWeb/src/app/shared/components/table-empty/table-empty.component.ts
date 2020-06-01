import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-table-empty',
    templateUrl: './table-empty.component.html',
})
export class TableEmptyComponent implements OnInit {
    @Input('message') inputMessage: string;
    
    message: string = 'Chưa có dữ liệu';
    ngOnInit(): void {
        if (this.inputMessage) this.message = this.inputMessage;
    }
}