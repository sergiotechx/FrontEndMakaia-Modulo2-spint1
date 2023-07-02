import { ChattingRender } from './renders/chatting.js';
import { Db } from '../services/db.js';
import { DateTime } from "luxon";
import Swal from 'sweetalert2';


export class Chatting {
    constructor() {
        try {
            this.DOMElement = undefined;
            this.chattingRender = undefined
            this.idFrom = undefined;
            this.idTo = undefined;
            this.db = new Db();
            this.chattingKey = '';
            this.messagesBuffer = undefined;
        }
        catch (error) {
            throw error;
        }
    }
    start(_DOMElement, _idFrom, _idTo) {
        this.DOMElement = _DOMElement;
        this.chattingRender = new ChattingRender();
        this.idFrom = _idFrom;
        this.idTo = _idTo;
        this.chattingRender.render(_DOMElement);
        this.fillChattingHeader();
        this.fillChatingSend();
        this.clearChattingBody();
        this.initalEvents();
        this.chattingMonitoring();
    }

    async fillChattingHeader() {
        try {
            let ChattingHeaderHTML = document.querySelector('.chatting__header');

            let userDataFROM = await this.db.getUser(this.idTo);
            if (Object.keys(userDataFROM).length > 0) {

                this.chattingRender.renderHeader(ChattingHeaderHTML, userDataFROM.image, userDataFROM.name, userDataFROM.phrase);
                let backHtml = ChattingHeaderHTML.querySelector('.Back');
                backHtml.addEventListener('click',event=>{location.reload()});
                let searchHtml = ChattingHeaderHTML.querySelector('.Search');
                searchHtml.addEventListener('click',event=>{this.search(event)});
            }
        }
        catch (error) {
            throw error;
        }
    }
    clearChattingBody() {
        let chattingBodyHtml = document.querySelector('.chatting__body');
        chattingBodyHtml.innerHTML = '';
    }
    fillChatingSend() {
        try {
            let ChattingSendHTML = document.querySelector('.chatting__send');
            this.chattingRender.renderSend(ChattingSendHTML);


        }
        catch (error) {
            throw error;
        }
    }
    initalEvents() {

        let sendButtonHTML = document.querySelector('.chatting__send__button');
        sendButtonHTML.addEventListener('click', (event) => { this.sendMessage(event) });
    }

    async sendMessage(event) {
        let messageHtml = document.querySelector('.chatting__send__input');

        let idFrom = this.idFrom;
        let idTo = this.idTo;
        let message = {
            userFrom: idFrom,
            userTo: idTo,
            message: messageHtml.value,
            viewed: true
        }
        await this.db.createMessage(message);
        messageHtml.value = '';
    }

    async chattingMonitoring() {

        this.chattingKey = setInterval(() => this.chattingMonitoringImplementation(this.db, this.idFrom, this.idTo, this.chattingRender), 2000);
    }
    async chattingMonitoringImplementation(db, idFrom, idTo, chattingRender) {
        let result1 = await this.db.getMessages(idFrom, idTo);
        let result2 = await this.db.getMessages(idTo, idFrom);
        let combinedArray = result1.concat(result2);
        combinedArray.sort((firstItem, secondItem) => firstItem.id - secondItem.id);
        let chatBodyHtml = document.querySelector('.chatting__body');
        chattingRender.renderConversation(chatBodyHtml, combinedArray, idFrom, idTo);
        this.registerChatOperations();
    }

    registerChatOperations() {
        let MessageHtml = document.querySelectorAll('.Message');
        MessageHtml.forEach(message => {
            let buttons = message.querySelectorAll("sl-icon-button");
            if (buttons.length > 0) {

                buttons[0].addEventListener('click', event => { this.editSendMessage(event, message.id) });
                buttons[1].addEventListener('click', event => { this.hideEdition(event, message.id) });
                buttons[2].addEventListener('click', event => { this.enableEditMessage(event, message.id) });
                buttons[3].addEventListener('click', event => { this.deleteMessage(event, message.id) });
            }
        }
        );
    }

    async editSendMessage(event, message_id) {
        let MessageHtml = event.target.parentNode.parentNode.parentNode.querySelector('.MessageType1 p');
        let inputHtml = event.target.parentNode.parentNode.parentNode.querySelector('.MessageType1 sl-input');
        let editionButtonsHtml = event.target.parentNode.parentNode.parentNode.querySelector('.Message_edition');
        let message = inputHtml.value;
        MessageHtml.textContent = inputHtml.value;
        inputHtml.style.display = "none";
        editionButtonsHtml.style.display = "none";
        let MessageData = await this.db.getMessage(message_id);
        if (Object.keys(MessageData).length > 0) {
            MessageData.message = message;
            MessageData.dateTime = DateTime.local().toISO();
            await this.db.updateMessage(MessageData);
            this.chattingMonitoring();
        }
    }

    hideEdition(event, message_id) {
        let inputHtml = event.target.parentNode.parentNode.parentNode.querySelector('.MessageType1 sl-input');
        let editionButtonsHtml = event.target.parentNode.parentNode.parentNode.querySelector('.Message_edition');
        inputHtml.style.display = "none";
        editionButtonsHtml.style.display = "none";
        this.chattingMonitoring();
    }



    enableEditMessage(event, message_id) {
        let MessageHtml = event.target.parentNode.parentNode.querySelector('.MessageType1 p');
        let message = MessageHtml.textContent;
        let inputHtml = event.target.parentNode.parentNode.querySelector('.MessageType1 sl-input');
        inputHtml.value = message;
        inputHtml.style.display = "inline";
        let editionButtonsHtml = event.target.parentNode.parentNode.querySelector('.Message_edition');
        editionButtonsHtml.style.display = "inline";
        clearInterval(this.chattingKey);
    }

    async deleteMessage(event, message_id) {
        try {
            console.log(this.chattingKey);
            clearInterval(this.chattingKey);
            let element = event.target.parentNode.parentNode.parentNode;
            let response = await Swal.fire({
                title: 'Do you want to delete the message?',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                customClass: {
                    actions: 'my-actions',
                    cancelButton: 'order-1 right-gap',
                    confirmButton: 'order-2',
                }
            });
            if (response.isConfirmed) {
                element.style.display = "none";
                await this.db.deleteMessage(message_id);
            }
            this.chattingMonitoring();
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
    async search(event){
        let rightHtml =  document.querySelector('.chat__right');
        rightHtml.style.width = "45%";
        let searchHtml = document.querySelector('.chat__search');
        let nameHtml = searchHtml.querySelector('.search__header p');
        searchHtml.style.display = "flex";
        let userData =  await this.db.getUser(this.idTo);
        nameHtml.textContent = userData.name +`'s Messages`;
        let result1 = await this.db.getMessages(this.idFrom, this.idTo);
        let result2 = await this.db.getMessages(this.idTo, this.idFrom);
        let combinedArray = result1.concat(result2);
        combinedArray.sort((firstItem, secondItem) => firstItem.id - secondItem.id);
        this.messagesBuffer = combinedArray;
      
        
        
    }
}