export function convertNumberToTime(inp: number): string {
    if (!inp) return;
    const inp_temp = (inp + '').split('.');
    if (inp_temp.length == 1) return `${inp_temp[0]}:00`;
    return `${inp_temp[0]}:${inp_temp[1].length <= 1 ? inp_temp[1] + '0' : inp_temp[1]}`;
}

export function convertTimeToNumber(inp: string): number {
    if (!inp) return;
    const inp_temp = inp.split(':');
    return parseFloat(inp_temp.join('.'));
}

export function getTimeString(inp: number): string {
    if (!inp) return;
    const time = new Date(inp);
    const hours = time.getHours();
    const minute = time.getMinutes();
    return `${hours}:${minute < 10 ? '0' + minute : minute}`;
}

export function getTime(inp: number): number {
    const time_temp = (inp + '').split('.');
    return +time_temp[0] * 1000 * 60 * 60 + (time_temp[1] ? +((time_temp[1] + '').length == 1 ? time_temp[1] + '0' : time_temp[1]) * 1000 * 60 : 0);
}

export function caculatorTime(inp: string, period: number): string {
    if (!inp || (!period && period != 0)) return;
    const time_temp = new Date(`1/1/1111 ${inp}`).getTime() + period;
    return getTimeString(time_temp);
}