import axiosClient from "./axiosClient";
import { Pet } from "src/models/pet";

export class PetsAPI {
    //filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(pet: Pet) {
        return Object.fromEntries(
            Object.entries(pet).filter((value) => value != null),
        );
    }

    static async getAllPets(ownerId: string): Promise<Pet[]> {
        const response = await axiosClient.get(`/owners/${ownerId}/pets`, {
            params: { petId: "" },
        });
        return response?.data.map((petJson) => new Pet(petJson));
    }

    static async getPet(petId: string): Promise<Pet> {
        const response = await axiosClient.get(`/pets/${petId}`, {
            params: { petId: petId },
        });
        return new Pet(response?.data);
    }

    //input: updated parameters for pets, with unchanged fields as null
    static async updatePet(
        ownerId: string,
        petId: string,
        pet: Pet,
    ): Promise<void> {
        const changedValues = this.removeNull(pet);
        await axiosClient.put(`/owners/${ownerId}`, changedValues, {
            params: { petId: petId },
        });
    }

    static async deletePet(ownerId: string, petId: string): Promise<void> {
        await axiosClient.delete(`/owners/${ownerId}/pets/${petId}`);
    }

    static async createPet(ownerId: string, pet: Pet): Promise<void> {
        await axiosClient.post(`/owners/${ownerId}/pets`, pet);
    }
}
