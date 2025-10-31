import { PetDiary } from "src/models/pet-diary";
import axiosClient from "./axiosClient";

export class PetDiaryAPI {
    //filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(diary: PetDiary) {
        return Object.fromEntries(
            Object.entries(diary).filter((value) => value != null),
        );
    }

    static async createDiary(
        ownerId: number,
        petId: number,
        petDiary: PetDiary,
    ): Promise<void> {
        await axiosClient.post(
            `/owners/${ownerId}/pets/${petId}/diary`,
            petDiary,
        );
    }
}
