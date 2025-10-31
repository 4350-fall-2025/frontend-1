export enum SterileStatus {
    sterile = "STERILE",
    nonsterile = "NON_STERILE",
    unknown = "UNKNOWN",
}

export enum AnimalGroup {
    small = "Small mammal",
    farm = "Farm",
    equine = "Equine",
    bird = "Bird",
    reptile = "Reptile",
    amphibian = "Amphibian",
    fish = "Fish",
    invertebrate = "Invertebrate",
    other = "Other",
}

export class Pet {
    public readonly name: string;
    public readonly breed: string;
    public readonly sex: string;
    public readonly species: string;
    public readonly id: number;
    public readonly birthdate: string;
    public readonly estimatedBirthdate: boolean;
    public readonly sterileStatus: SterileStatus;
    public readonly animalGroup: string;

    constructor(JSON) {
        Object.assign(this, JSON);
    }
}
