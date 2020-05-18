import { Pipe, PipeTransform } from "@angular/core";
import { getDateDDMM } from '../../helper/util/date';

@Pipe({
    name: 'datetimeToDate'
})
export class ConvertDatetimeToDatePipe implements PipeTransform {
    transform(value: Date | number | string, ...args: any[]): any {
        return getDateDDMM(value);
    }
}