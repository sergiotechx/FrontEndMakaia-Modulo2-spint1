import { DateTime } from "luxon";
export class ChattingRender {

    render(DOMElement) {
        try {
            DOMElement.innerHTML = `
           <div class="chatting__header">
           </div>     
           <div class="chatting__body">
           </div>
           <div class="chatting__send">
           </div>
        `;
        }
        catch (error) {
            throw error;
        }
    }

    renderHeader(DOMElement, imageURL, name, phrase) {
        try {
            DOMElement.innerHTML = `
               <figure>
                <img src="${imageURL}" />
                <sl-icon-button name="box-arrow-left" label="Back" class="Back"></sl-icon-button>
                <sl-icon-button name="search" label="Search" class="Search" ></sl-icon-button>
               </figure>
               <div class="chatting__header__name">
                   <h5>${name}</h5>
                   <h6>${phrase}</h6>
               </div>
        `;
        }
        catch (error) {
            throw error;
        }
    }
    renderSend(DOMElement) {
        try {
            DOMElement.innerHTML = `
         <sl-input placeholder="Put your thoughts here" size="medium" pill class="chatting__send__input"></sl-input>
         <sl-icon-button name="send" label="" class="chatting__send__button" ></sl-icon-button>
         `;
        }
        catch (error) {
            throw error;
        }
    }
    renderConversation(DOMElement, conversation, idFrom, idTo) {
        try {
            let htmlMessages = '';
            let messageOptionsHtml = `<div class="Message__Operations">
                 <div class="Message_edition">
                       <sl-icon-button class="Message__Edition_buttons" name="send" label="Send"></sl-icon-button>
                       <sl-icon-button class="Message__Edition_buttons" name="x-circle" label="Cancel"></sl-icon-button>   
                 </div>
                <sl-icon-button  name="pencil" label="Edit"></sl-icon-button>
                <sl-icon-button  name="trash" label="Delete"></sl-icon-button>
                </div>`;
                let optionFieldHtml = '<sl-input placeholder="Fix your thoughts here" size="small" pill clearable></sl-input>'
            conversation.forEach((message) => {
                let convType = message.userFrom == idFrom ? 'MessageType1' : 'MessageType2';
                let date = DateTime.fromISO(message.dateTime);
                let formatedDate = date.toFormat('yyyy-LL-dd');
                let messageOptions = message.userFrom == idFrom ? messageOptionsHtml : '';
                let inputOptions = message.userFrom == idFrom ? optionFieldHtml : ''
                htmlMessages += `
                            <div class="Message"  id="${message.id}" >
                                    <div class="${convType}">
                                        <p>${message.message}</p>
                                        ${inputOptions}
                                        <h6>${formatedDate}</h6>
                                        ${messageOptions}
                                    </div>
                            </div>        `;
            });
            DOMElement.innerHTML = htmlMessages;
        }
        catch (error) {
            throw error;
        }
    }

}
