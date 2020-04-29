export function convertNumberToTime(inp: number): string {
    if (!inp) return;
    const inp_temp = (inp + '').split('.');
    if (inp_temp.length == 1) return `${inp_temp[0]}:00`;
    return `${inp_temp[0]}:${inp_temp[1].length <= 1 ? inp_temp[1] + '0' : inp_temp[1]}`;
}

export function converTimeToNumber(inp: string): number {
    if (!inp) return;
    const inp_temp = inp.split(':');
    return parseFloat(inp_temp.join('.'));
}