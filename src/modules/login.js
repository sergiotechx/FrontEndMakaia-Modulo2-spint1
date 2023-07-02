import { LoginRender } from './renders/login.js'
import { Db } from "../services/db.js";
import { Session } from "../services/session.js";
import Swal from 'sweetalert2'

export class Login {
    constructor(_htmlPage) {

        this.htmlPage = _htmlPage;
        this.formLogin = undefined;
        this.formRegister = undefined;
        this.db = new Db();
        this.session = new Session();
        new LoginRender(this.htmlPage).render();
        this.loginDocument = undefined;
        this.registerDocument = undefined;

        document.addEventListener('DOMContentLoaded', async () => {
            this.loginDocument = document.querySelector("#form__login");
            this.loginDocument.addEventListener("submit", (event) => { this.login(event) })
            this.registerDocument = document.querySelector("#form__register");
            this.registerDocument.addEventListener("submit", (event) => { this.register(event) })
        });
    }


    async login(event) {
        try {
            event.preventDefault();
            let inputs = event.target.querySelectorAll('sl-input');
            let cellNumber = inputs[0].value;
            let password = inputs[1].value;
            let userData = await this.db.login(cellNumber, password);

            if (Object.keys(userData).length > 0) {
                let result = await this.db.updateSession(userData);
                if (result == true) {
                    this.session.removeSession();
                    this.session.createSession(userData);
                    location.reload();
                }
            }
            else {

                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid credentials',
                    icon: 'error',
                    confirmButtonText: 'Continue'
                })
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Continue'
            })
        }
    }

    async register(event) {
        try {
            event.preventDefault();
            let inputs = event.target.querySelectorAll('sl-input');
            let fullName = inputs[0].value;
            let cellNumber = inputs[1].value;
            let password = inputs[2].value;
            let repeatPassword = inputs[3].value;
            let imageUrl = inputs[4].value;
            let phrase = inputs[5].value;
            if(password!=repeatPassword){
                Swal.fire({
                    title: 'Error!',
                    text: 'Password and RepeatPassword does not match!',
                    icon: 'error',
                    confirmButtonText: 'Continue'
                });
                return;
            }
            let newUser =
            {
                name: fullName,
                cellNumber: cellNumber,
                password: password,
                image: imageUrl,
                connected: false,
                phrase: phrase,
                last_connection: ""
            };
            let userData = await this.db.createUser(newUser);
            console.log("outside", userData);
            if (Object.keys(userData).length > 0) {
                let response = await Swal.fire({
                                           title: 'Success',
                                           text: 'Registration sucessfully',
                                           icon: 'success',
                                           confirmButtonText: 'Continue'
                                              });
                location.reload();
            }
        }
        catch (error) { }
    }

}



