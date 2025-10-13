import axiosClient from "./axiosClient";
import { Owner } from "src/models/Owner";

//note: currently everything returns mocked info, actual api code is commented out
export class OwnersAPI {
    //filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(owner: Owner) {
        return Object.fromEntries(
            Object.entries(owner).filter(([key, value]) => value != null),
        );
    }

    //input: owner id
    static async getOwner(id: number): Promise<Owner> {
        // const response = await axiosClient.get(`/owners/${id}`);
        // return response?.data;
        return new Owner({
            email: "test@gmail.com",
            firstName: "Test",
            lastName: "Account",
            password: "12345678",
            pets: null,
            id: "01",
        });
    }

    //input: updated parameters, with unchanged fields as null
    //output: http status code
    static async updateOwner(id: number, owner: Owner): Promise<void> {
        // const changedValues = this.removeNull(owner);
        // const response = await axiosClient.put(`/owners/${id}`, changedValues);
    }

    //input: owner id
    static async deleteOwner(id: number): Promise<void> {
        // const response = await axiosClient.delete(`/owners/${id}`);
        // return response?.status;
    }

    //input: owner object with id field as null
    //returns: status code
    static async ownerSignUp(owner: Owner): Promise<void> {
        // const response = await axiosClient.post(`/owners/create`, owner);
        // console.log(response);
        // return response?.status;
    }
}
