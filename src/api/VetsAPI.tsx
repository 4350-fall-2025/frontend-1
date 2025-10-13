import axiosClient from "./axiosClient";
import { Vet } from "src/models/Vet";

export class VetsAPI {
    //filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(vet: Vet) {
        return Object.fromEntries(
            Object.entries(vet).filter(([key, value]) => value != null),
        );
    }

    static async getVet(id: number): Promise<Vet> {
        // const response = await axiosClient.get(`/vets/${id}`);
        // return response?.data;
        return new Vet({
            email: "test@gmail.com",
            firstName: "Test",
            lastName: "Account",
            password: "12345678",
            id: 1,
            certification: "yes",
        });
    }

    //input: updated parameters for pets, with unchanged fields as null
    //output: http status code
    static async updateVet(id: number, vet: Vet): Promise<void> {
        // const changedValues = this.removeNull(vet);
        // const response = await axiosClient.put(`/vets/${id}`, changedValues);
        // return response?.status;
    }

    static async deleteVet(id: number): Promise<void> {
        // const response = await axiosClient.delete(`/vets/${id}`);
        // return response?.data;
    }

    //input: vet object with id field as null
    //returns: status code
    static async vetSignUp(vet: Vet): Promise<void> {
        // const response = await axiosClient.post(`/vets/create`, vet);
        // return response?.status;
    }
}
