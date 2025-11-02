export enum SterileStatus {
    sterile = "STERILE",
    nonsterile = "NON_STERILE",
    unknown = "UNKNOWN",
}
export enum AnimalGroup {
    small = "SMALL_MAMMAL",
    farm = "FARM",
    equine = "EQUINE",
    bird = "BIRD",
    reptile = "REPTILE",
    amphibian = "AMPHIBIAN",
    fish = "FISH",
    invertebrate = "INVERTEBRATE",
    other = "OTHER",
}

export class Pet {
    public readonly name: string;
    public readonly breed: string;
    public readonly sex: string;
    public readonly species: string;
    public readonly id: string;
    public readonly birthdate: string;
    public readonly estimatedBirthdate: boolean;
    public readonly sterileStatus: SterileStatus;
    public readonly animalGroup: AnimalGroup;

    constructor(JSON) {
        Object.assign(this, JSON);
    }
}
