import { ChatRender } from './renders/chat.js';
import { Chatting } from './chatting.js'
import { Session } from '../services/session.js';
import { Db } from '../services/db.js';
import Swal from 'sweetalert2';
import { DateTime } from "luxon";


export class Chat {
    constructor(_htmlPage) {
        this.htmlPage = _htmlPage;
        this.userHeader = undefined;
        this.chatRender = new ChatRender(this.htmlPage);
        this.chatRender.render();
        this.session = new Session().getSession();
        this.db = new Db();
        this.chat__listusersHtml = document.querySelector(".chat__listusers");
        this.usersInfo = undefined;
        this.userListKey = undefined;
        this.chattingKey = undefined;
        this.chatting = new Chatting();
        


        document.addEventListener('DOMContentLoaded', async () => {
            this.fillUserHeader();
            this.fillProfile();
            this.userList();
            this.userMessageSearchEvent();
            window.addEventListener("resize", this.adjustResolution);
        });
    }
    fillUserHeader() {
        this.userHeader = document.querySelector('.chat__user');
        let nameImageHtml = this.userHeader.querySelector('figure');
        let nameHtml = document.querySelector('.chat__name');
        this.chatRender.renderUserImage(nameImageHtml, this.session.image);
        this.chatRender.renderUserNamePhrase(nameHtml, this.session.name, this.session.phrase);
        let logOutHtml = document.querySelector('.chat__button--logout');
        logOutHtml.addEventListener('click', (event) => { this.logOut() });
        let profileHtml = document.querySelector('.chat__button--profile');
        profileHtml.addEventListener('click', (event) => { this.callProfile(event) });
        let profile__backHtml = document.querySelector('.profile__button--back');
        profile__backHtml.addEventListener('click', (event) => { location.reload(); });
        let profile__buttonHtml = document.querySelector('.profile__button');
        profile__buttonHtml.addEventListener('click', (event) => { this.updateProfile(event); });
    }
    fillProfile() {
        let profile__photo__srcHtml = document.querySelector('.profile__photo__src');
        let profile__imageHtml = document.querySelector('.profile__image');
        let profile__nameHtml = document.querySelector('.profile__name');
        profile__photo__srcHtml.setAttribute("src", this.session.image);
        profile__imageHtml.value = this.session.image;
        profile__nameHtml.value = this.session.name;

    }
    async callProfile(event) {
        let userHtml = document.querySelector('.chat__user');
        let listUsersHtml = document.querySelector('.chat__listusers');
        let profileHtml = document.querySelector('.profile');
        userHtml.style.display = "none";
        listUsersHtml.style.display = "none";
        profileHtml.style.display = "flex";
    }
    async updateProfile(event) {
        try {
            let profile__imageHtml = document.querySelector('.profile__image');
            let profile__nameHtml = document.querySelector('.profile__name');
            let imageUrl = profile__imageHtml.value;
            let name = profile__nameHtml.value;
            let newDataStr = `{
                  "id":${this.session.id},
                  "name": "${name}",
                  "cellNumber": "${this.session.cellNumber}",
                  "password": "${this.session.password}",
                  "image": "${imageUrl}",
                  "connected": true,
                  "phrase": "${this.session.phrase}",
                  "last_connection": "${this.session.last_connection}"
                }
            `;


            let newData = JSON.parse(newDataStr);
            let result = this.db.updateSession(newData);

            if (result) {
                result = new Session().createSession(newData);

                if (result) {

                    this.session = new Session().getSession();
                    let profile__photo__srcHtml = document.querySelector('.profile__photo__src');
                    profile__photo__srcHtml.setAttribute("src", imageUrl);

                    Swal.fire({
                        title: 'Updated',
                        text: 'Profile updated',
                        icon: 'success',
                        confirmButtonText: 'Continue'
                    });
                }
            }
        }
        catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Continue'
            });
        }


    }
    async logOut() {
        try {
            let operation = await new Db().logout(this.session.cellNumber, this.session.password);
            if (operation) {
                new Session().removeSession();
                location.reload();
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
    async userListMonitoring(db,session,chatting) {
        try {

            this.usersInfo = await db.getUsers();
            this.session = session;
            this.chatting = chatting;
            this.chat__listusersHtml = document.querySelector(".chat__listusers");
            let html = '';
        

            this.usersInfo.forEach((person) => {
                      
                if (person.id != this.session.id) {
                    let color = person.connected ? '#007E3F' : '#F20000';
                    let date = DateTime.fromISO(person.last_connection);
                    let formatedDate = date.toFormat('yyyy-LL-dd');


                    html += `
                            <div class="userList" >
                                <figure class="userList__figure" id=${person.id}>
                                    <img src="${person.image}"  style="border-radius:50%;" /> 
                                    <sl-icon name="circle" style="background:${color};color:${color};border-radius:50%; width:0.5rem;height:0.5rem;position:absolute" ></sl-icon>
                                </figure>
                                <label class="userList__name">${person.name}</label>
                                <p class="userList__date">${formatedDate}</p>
                            </div>`;

                }
            }
            );
            this.chat__listusersHtml.innerHTML = html;
            let usersHtml = document.querySelectorAll('.userList__figure');
            let chat__rightHTML = document.querySelector('.chat__right');
            let chat__lefttHTML = document.querySelector('.chat__left');
            let idFrom = this.session.id;
            usersHtml.forEach(user => {
                user.addEventListener('click', (event) => {
                    let userChatId = event.target.parentNode.id;
                    let idTo = userChatId;
                    clearInterval(this.chatting.chattingKey);
                    this.chatting.start(chat__rightHTML, idFrom, idTo);
                    if(window.innerWidth < 701){
                        chat__lefttHTML.style.display = 'none';
                        chat__rightHTML.style.display = 'flex';
                        chat__rightHTML.style.width = '100%';
                    }
                   
                });
            });
            
            if(this.chatting.chattingKey ==''){
                const result = this.usersInfo.filter(person => person.id != this.session.id);
                if(result.length>0){
                    let idTo = result[0].id;
                    this.chatting.start(chat__rightHTML, idFrom, idTo);
                }
            }
       

        }
        catch (error) {
            alert(error.message)
        }


    }
    async userList() {
        this.userListKey = setInterval(()=>{this.userListMonitoring(this.db,this.session,this.chatting)}, 2000);
    }
    
    adjustResolution(){
         let chatLeftHtml = document.querySelector('.chat__left');
         let chatRightHtml = document.querySelector('.chat__right');
         let chatSearchHtml =document.querySelector('.chat__search');
         let backButton = chatRightHtml.querySelector('.chatting__header .Back');
         let searchButton = chatRightHtml.querySelector('.chatting__header .Search');

         
       
        if(window.innerWidth > 700){
            chatLeftHtml.style.display = 'flex';
            chatLeftHtml.style.width = '25%';
            chatRightHtml.style.display = 'flex';
            chatRightHtml.style.width = '75%';
          
        }
        else{
            chatLeftHtml.style.display = 'flex';
            chatLeftHtml.style.width = '100%';
            chatRightHtml.style.display = 'none';
            chatSearchHtml.style.display = 'none';
        }
    }
    userMessageSearchEvent(){
        let closeSearchHtml = document.querySelector(".search__close");
        closeSearchHtml.addEventListener('click',event=> {location.reload()})
        let makeSearchHtml = document.querySelector(".search__input sl-input"); 
        let searchMessageHtml = document.querySelector(".search__messages"); 
       
        
        let timeOut ;
     
        makeSearchHtml.addEventListener('input', event=>{
            clearTimeout(timeOut);
            
            timeOut = setTimeout(()=> {
                 let word = makeSearchHtml.value.toLowerCase();
                 let  mensajesFiltrados = this.chatting.messagesBuffer.filter(
                    message=>message.message.toLowerCase().includes(word)
                 );
                 let html=``;
                 mensajesFiltrados.forEach(message=>{
                    html +=`
                         <div class="search__message">
                         <h6> ${message.dateTime}<h6>
                         <h5>${message.message}</h5>
                         </div>
                    `;})
                    searchMessageHtml.innerHTML=  html;
               
                  
            }, 1000); 
            
               
        });

      
    }



}