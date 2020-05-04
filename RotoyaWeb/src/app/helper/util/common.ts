import { isObject } from 'util';

export function filterObjectChange(oldObj: any, newObj: any): any {
    if (!isObject(oldObj) || !isObject(newObj)) return;
    const result = {} as any;
    Object.keys(newObj).map(key => {
        if(newObj[key] && newObj[key] != oldObj[key]) result[key] = newObj[key];
    })
    if (!Object.keys(result).length) return;
    return result;
}