import { axiosBase } from './base.service';

export async function getSports() {
    return axiosBase().get('/sport/getAllSport');
}

export async function getSportCenters() {
    return axiosBase().get('/sport/getSportCenter');
}

export async function getSportCentersFilter(latitude, longitude, distance, sport) {
    return axiosBase().get('/map/getSportCenterByGeolocationAndSport', {
        params: {
            latitude,
            longitude,
            distance,
            sport
        }
    })
}

export async function getSportCenterSport(sport) {
    return axiosBase().get('sport/getSportCenterSport', {
        params: {
            sport
        }
    })
}

export async function getSportCentersByGeolocation(latitude, longitude, distance) {
    return axiosBase().get('/map/getSportCenterByGeolocation', {
        params: {
            latitude,
            longitude,
            distance
        }
    })
}