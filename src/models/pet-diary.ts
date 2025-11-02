import { Pet } from "./pet";

export enum ContentType {
    general = "GENERAL",
    behaviour = "BEHAVIOUR",
    measurement = "MEASUREMENT",
    diet = "DIET",
    other = "OTHER",
}

export class PetDiary {
    public readonly pet: Pet;
    public readonly contentType: ContentType;
    public readonly contentBody: string;
    public readonly media: File[];

    constructor(JSON) {
        Object.assign(this, JSON);
    }
}
