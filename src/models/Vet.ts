export class Vet {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    id: number;
    certification: string;

    constructor(JSON) {
        Object.assign(this, JSON);
    }
}
