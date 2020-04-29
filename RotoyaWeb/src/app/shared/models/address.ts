export interface ICity {
    id: number;
    code: string;
    name: string;
}

export class City implements ICity {
    public id: number;
    public code: string;
    public name: string;
    constructor(city: ICity) {
        this.id = city.id;
        this.code = city.code;
        this.name = city.name;
    }
}