import axiosClient from "./axiosClient";
import { Vet } from "src/models/vet";

export class VetsAPI {
    //filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(vet: Vet) {
        return Object.fromEntries(
            Object.entries(vet).filter((value) => value != null),
        );
    }

    static async getVet(id: number): Promise<Vet> {
        const response = await axiosClient.get(`/vets/${id}`);
        return new Vet(response?.data);
    }

    //input: updated parameters for pets, with unchanged fields as null
    static async updateVet(id: number, vet: Vet): Promise<void> {
        const changedValues = this.removeNull(vet);
        await axiosClient.put(`/vets/${id}`, changedValues);
    }

    static async deleteVet(id: number): Promise<void> {
        await axiosClient.delete(`/vets/${id}`);
    }

    static async vetSignUp(vet: Vet): Promise<void> {
        await axiosClient.post(`/vets/signup`, vet);
    }

    static async vetLogin(loginJSON): Promise<Vet> {
        const response = await axiosClient.post(`/auth/login`, loginJSON);
        return new Vet(response?.data);
    }
}
