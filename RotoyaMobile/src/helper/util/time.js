const convertFloatToTime = (inp) => {
    let hour = '00', minute = '00';
    const concatNumber = (+inp).toString().split('.');
    hour = concatNumber[0].length == 1 ? '0' + concatNumber[0] : concatNumber[0];
    if (concatNumber.length != 2) return `${hour}:${minute}`;
    minute = concatNumber[1].length == 1 ? concatNumber[1] + '0' : concatNumber[1];
    return `${hour}:${minute}`;
}

export default {
    convertFloatToTime
}