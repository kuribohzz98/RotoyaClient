const getDateDDMM = (inpDate) => {
    if (!inpDate) return;
    let date = new Date(inpDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`
}

const convertDateDDMMToMMDD = (str) => {
    let date = str.split(' - ');
    if (date.length != 3) data = str.split('-');
    return `${date[1]}/${date[0]}/${date[2]}`;
}

export default {
    getDateDDMM,
    convertDateDDMMToMMDD
}