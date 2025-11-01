import axiosClient from "./axiosClient";
import { Owner } from "src/models/owner";

export class OwnersAPI {
    //This function filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(owner: Owner) {
        return Object.fromEntries(
            Object.entries(owner).filter((value) => value != null),
        );
    }

    static async getOwner(id: string): Promise<Owner> {
        const response = await axiosClient.get(`/owners/${id}`);
        return new Owner(response?.data);
    }

    //input: updated parameters, with unchanged fields as null
    static async updateOwner(id: string, owner: Owner): Promise<void> {
        const changedValues = this.removeNull(owner);
        await axiosClient.put(`/owners/${id}`, changedValues);
    }

    static async deleteOwner(id: string): Promise<void> {
        await axiosClient.delete(`/owners/${id}`);
    }

    static async ownerSignUp(owner: Owner): Promise<Owner> {
        const response = await axiosClient.post(`/owners/signup`, owner);
        return new Owner(response?.data);
    }

    static async ownerLogin(loginJSON): Promise<Owner> {
        const response = await axiosClient.post(`/auth/login`, loginJSON);
        return new Owner(response?.data);
    }
}
