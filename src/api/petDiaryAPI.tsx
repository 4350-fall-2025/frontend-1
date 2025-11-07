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
        petId: string,
        petDiary: PetDiary,
    ): Promise<PetDiary> {
        const response = await axiosClient.post(
            `/pets/${petId}/diaries`,
            petDiary,
        );
        return response.data;
    }

    static async getDiaryEntries(
        petId: string,
        from?: Date,
        to?: Date,
    ): Promise<PetDiary[]> {
        const response = await axiosClient.get(`/pets/${petId}/diaries`, {
            params: {
                from: from,
                to: to,
            },
        });
        return response.data;
    }
}
