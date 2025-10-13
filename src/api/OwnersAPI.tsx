import axiosClient from "./axiosClient";

class OwnersAPI {
    //filters out null values from the owner object
    //ChatGPT-5 was used to make this function
    static removeNull(owner: Owner) {
        return Object.fromEntries(
            Object.entries(owner).filter(([key, value]) => value != null),
        );
    }

    //input: owner id
    static async getOwner(id: number): Promise<Owner> {
        const response = await axiosClient.get(`/owners/${id}`);
        return response?.data;
    }

    //input: updated parameters, with unchanged fields as null
    //output: http status code
    static async updateOwner(id: number, owner: Owner): Promise<number> {
        const changedValues = this.removeNull(owner);

        const response = await axiosClient.put(`/owners/${id}`, changedValues);
        return response?.status;
    }

    //input: owner id
    static async deleteOwner(id: number): Promise<number> {
        const response = await axiosClient.delete(`/owners/${id}`);
        return response?.status;
    }

    //input: owner object with id field as null
    //returns: status code
    static async ownerSignUp(owner: Owner): Promise<number> {
        const response = await axiosClient.post(`/owners/create`, owner);
        return response?.status;
    }
}
