export class Vet {
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly email: string;
    public readonly password: string;
    public readonly id: string;
    public readonly certification: string;

    constructor(JSON) {
        Object.assign(this, JSON);
    }
}
