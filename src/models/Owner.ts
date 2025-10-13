export class Owner {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    id: number;

    constructor(ownerJSON) {
        Object.assign(this, ownerJSON);
    }
}
