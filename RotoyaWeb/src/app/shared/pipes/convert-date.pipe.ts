import { Pipe, PipeTransform } from "@angular/core";
import { getDateDDMM } from '../../helper/util/date';

@Pipe({
    name: 'datetimeToDate'
})
export class ConvertDatetimeToDate implements PipeTransform {
    transform(value: Date | number, ...args: any[]): any {
        return getDateDDMM(value);
    }
}