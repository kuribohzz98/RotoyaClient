const TimeOutBooking = (7 * 60 - 5) * 1000; // 6'55'' 

const IconSports = {
    SOCCER: 'soccer',
    BADMINTON: 'badminton',
    BASKETBALL: 'basketball',
    TENNIS: 'tennis-ball'
}

const SportEnum = {
    SOCCER: 0,
    TENNIS: 1,
    BASKETBALL: 2,
    BADMINTON: 3
}

const SportConvertName = {
    SOCCER: 'Bóng đá',
    TENNIS: 'Tennis',
    BADMINTON: 'Cầu lông',
    BASKETBALL: 'Bóng rổ'
}

const Gender = {
    Male: 'Nam',
    Femal: 'Nữ',
    Other: 'Khác'
}

export default {
    TimeOutBooking,
    IconSports,
    Gender,
    SportEnum,
    SportConvertName
}