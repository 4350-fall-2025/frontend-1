import axiosClient from "./axiosClient";
import { Owner } from "src/models/Owner";

//Note: currently all functions returns mock info, with the actual api code is commented out
export class OwnersAPI {
    //This function filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(owner: Owner) {
        return Object.fromEntries(
            Object.entries(owner).filter(([key, value]) => value != null),
        );
    }

    static async getOwner(id: number): Promise<Owner> {
        // const response = await axiosClient.get(`/owners/${id}`);
        // return response?.data;
        return new Owner({
            email: "test@gmail.com",
            firstName: "Test",
            lastName: "Account",
            password: "12345678",
            pets: null,
            id: 1,
        });
    }

    //input: updated parameters, with unchanged fields as null
    static async updateOwner(id: number, owner: Owner): Promise<void> {
        // const changedValues = this.removeNull(owner);
        // const response = await axiosClient.put(`/owners/${id}`, changedValues);
    }

    static async deleteOwner(id: number): Promise<void> {
        // const response = await axiosClient.delete(`/owners/${id}`);
    }

    static async ownerSignUp(owner: Owner): Promise<void> {
        // const response = await axiosClient.post(`/owners/create`, owner);
    }
}
