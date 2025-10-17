export class Pet {
    public readonly name: string;
    public readonly breed: string;
    public readonly sex: string;
    public readonly species: string;
    public readonly id: number;
    public readonly birthdate: string;
    public readonly sterileStatus: string;

    constructor(JSON) {
        Object.assign(this, JSON);
    }
}
