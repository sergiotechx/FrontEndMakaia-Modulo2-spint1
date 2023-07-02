import '../styles/style.scss';
import {Session} from "../services/session";
import {Login} from "./login.js";
import {Chat} from "./chat.js";
let htmlDocument = document.querySelector('#app');
let session = new Session();
let sessionData = session.getSession();

if(sessionData == false){
   new Login(htmlDocument);
}
else{
   new Chat(htmlDocument);
}




