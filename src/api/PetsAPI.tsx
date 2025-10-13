import axiosClient from "./axiosClient";
import { Pet } from "src/models/Pet";

class PetsAPI {
    //filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(pet: Pet) {
        return Object.fromEntries(
            Object.entries(pet).filter(([key, value]) => value != null),
        );
    }

    static async getAllPets(ownerId: number): Promise<Pet[]> {
        // const response = await axiosClient.get(`/owners/${ownerId}/pets`);
        // return response?.data;
        return [
            new Pet({
                name: "test",
                breed: "husky",
                sex: "male",
                species: "dog",
                birthdate: "2025-01-01",
            }),
        ];
    }

    static async getPet(ownerId: number, petId: number): Promise<Pet> {
        // const response = await axiosClient.get(`/owners/${ownerId}/pets`, {
        //     params: { petid: petId },
        // });
        // return response?.data;
        return new Pet({
            name: "test",
            breed: "husky",
            sex: "male",
            species: "dog",
            birthdate: "2025-01-01",
        });
    }

    //input: updated parameters for pets, with unchanged fields as null
    //output: http status code
    static async updatePet(
        ownerId: number,
        petId: number,
        pet: Pet,
    ): Promise<number> {
        // const changedValues = this.removeNull(pet);

        // const response = await axiosClient.put(
        //     `/owners/${ownerId}`,
        //     changedValues,
        //     {
        //         params: { petid: petId },
        //     },
        // );
        // return response?.status;
        return 200;
    }

    static async deletePet(ownerId: number, petId: number): Promise<number> {
        // const response = await axiosClient.delete(
        //     `/owners/${ownerId}/pets/${petId}`,
        // );
        // return response?.status;
        return 200;
    }

    //input: owner object with id field as null
    //returns: status code
    static async createPet(ownerId: number, pet: Pet): Promise<number> {
        // const response = await axiosClient.post(`/owners/${ownerId}/pets`, pet);
        // return response?.status;
        return 200;
    }
}
