import { Pipe, PipeTransform } from "@angular/core";
import { convertNumberToTime } from '../../helper/util/time';

@Pipe({
    name: 'numberToTime'
})
export class ConvertNumberToTimePipe implements PipeTransform {
    transform(value: number, ...args: any[]): any {
        return convertNumberToTime(value);
    }
}