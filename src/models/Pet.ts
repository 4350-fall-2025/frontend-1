export class Pet {
    name: string;
    breed: string;
    sex: string;
    species: string;
    id: number;
    birthdate: string;

    constructor(JSON) {
        Object.assign(this, JSON);
    }
}
