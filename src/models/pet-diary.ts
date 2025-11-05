import { Pet } from "./pet";

export enum ContentType {
    general = "GENERAL",
    behaviour = "BEHAVIOUR",
    measurement = "MEASUREMENT",
    diet = "DIET",
    other = "OTHER",
}

export class PetDiary {
    public readonly id: string;
    public readonly pet: Pet;
    public readonly contentType: ContentType;
    public readonly contentBody: string;
    public readonly createTimestamp: string;
    public readonly files: string[];

    constructor(JSON) {
        Object.assign(this, JSON);
    }
}
