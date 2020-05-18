const convertNumberToCurrency = (num) => {
    return (num + '')
        .replace('.', ',')
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

const convertDistance = (num) => {
    return (+num).toFixed(1);
}

export default {
    convertNumberToCurrency,
    convertDistance
}