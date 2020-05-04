import { Pipe, PipeTransform } from "@angular/core";
import { EGender } from './../../constants/common.constants';

@Pipe({
    name: 'gender'
})
export class ConvertGenderPipe implements PipeTransform {
    transform(value: string, ...args: any[]): any {
        return EGender[value];
    }
}