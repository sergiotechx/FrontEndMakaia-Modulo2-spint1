import axios from 'axios';
import { DateTime } from "luxon";
export class Db {
    constructor() {
       // this.Url = 'http://localhost:3000/';
       this.Url = 'https://jsonserver-sprint1.onrender.com/';
    }

    async login(cellNumber, password) {
        try {
            let response = await axios.get(this.Url + `users?cellNumber=${cellNumber}&password=${password}`);

            if (response.data.length > 0) {
                response = response.data[0];
                return ({
                    id: response.id,
                    name: response.name,
                    cellNumber: response.cellNumber,
                    password: response.password,
                    image: response.image,
                    connected: true,
                    phrase: response.phrase,
                    last_connection: DateTime.local().toISO()
                });

            }
            else {
                return ({});
            }
        }
        catch (error) {
            throw error;
        }
    }
    async logout(cellNumber, password) {
        try {
            let response = await axios.get(this.Url + `users?cellNumber=${cellNumber}&password=${password}`);

            if (response.data.length > 0) {
                response = response.data[0];
                let userData = {
                    id: response.id,
                    name: response.name,
                    cellNumber: response.cellNumber,
                    password: response.password,
                    image: response.image,
                    connected: false,
                    phrase: response.phrase,
                    last_connection: DateTime.local().toISO()
                };
                return (await this.updateSession(userData));
            }
            else {
                return ({});
            }
        }
        catch (error) {
            throw error;
        }
    }


    async getUsers() {
        try {
            let response = await axios.get(this.Url + 'users');
            if (response.data.length > 0) {
                return response.data;
            }
            else {
                return ({});
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getUser(id) {
        try {

            let response = await axios.get(this.Url + `users/${id}`);
            if (Object.keys(response.data).length > 0) {
                return response.data;
            }
            else {
                return ({});
            }
        }
        catch (error) {
            throw error;
        }
    }

    async updateSession(userData) {
        try {

            let response = await axios.patch(this.Url + `users/${userData.id}`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status == 200) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async createUser(userData) {
        try {
            const fecha = DateTime.fromISO("1600-01-01");
            userData.connected = false;
            userData.last_connection = DateTime.fromISO("1600-01-01").toISO();
            let response = await axios.post(this.Url + 'users/', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.statusText == 'Created') {

                return (response.data);
            }
            else {
                return ({});
            }
        }
        catch (error) {
            throw error;
        }
    }

    async createMessage(message) {
        try {
            message.dateTime = DateTime.local().toISO();
            let response = await axios.post(this.Url + 'messages/', message, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.statusText == 'Created') {

                return (response.data);
            }
            else {
                return ({});
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getAllMessages() {
        try {

            let response = await axios.get(this.Url + `messages`);
            if (Object.keys(response.data).length > 0) {
                return response.data;
            }
            else {
                return ({});
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getMessages(idFrom, idTo) {
        try {

            let response = await axios.get(this.Url + `messages?userFrom=${idFrom}&userTo=${idTo}`);
            if (Object.keys(response.data).length > 0) {
                return response.data;
            }
            else {
                return ([]);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getMessage(messageId) {
        try {

            let response = await axios.get(this.Url + `messages/${messageId}`);
            if (Object.keys(response.data).length > 0) {
                return response.data;
            }
            else {
                return ({});
            }
        }
        catch (error) {
            throw error;
        }
    }
    async deleteMessage(messageId) {
        try {
            let response = await axios.delete(this.Url + `messages/${messageId}`);
            if (response.status == 200) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async updateMessage(message) {
        try {
            let response = await axios.patch(this.Url + `messages/${message.id}`, message, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status == 200) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }
}