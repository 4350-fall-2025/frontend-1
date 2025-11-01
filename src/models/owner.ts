export class Owner {
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly email: string;
    public readonly password: string;
    public readonly id: string;

    constructor(ownerJSON) {
        Object.assign(this, ownerJSON);
    }
}
