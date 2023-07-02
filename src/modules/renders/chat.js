export class ChatRender {
    constructor(_htmlPage) {
        this.htmlPage = _htmlPage;
    }
    render() {
        try {
            let htmlCode = `
                <div class="chat">
                        <div class="chat__left">
                           <div class="profile">
                                <div class="profile__header">
                                           <button class="profile__button--back">
                                             <sl-icon name="box-arrow-left" title="Back" ></sl-icon>
                                           </button>
                                           <p>Profile</p>
                                </div>
                                <div class="profile__photo">
                                   
                                  <figure>
                                    <img class="profile__photo__src" />
                                  </figure>
                                  <sl-input label="Image URL" type="url" placeholder="Image URL" size="medium" pill required class="profile__image" required >
                                     <sl-icon name="person-bounding-box" slot="prefix"></sl-icon>
                                  </sl-input>
                                  <sl-input label="Full Name" placeholder="Full Name" size="medium" pill required class="profile__name" required>
                                       <sl-icon name="person" slot="prefix"></sl-icon>
                                   </sl-input>
                                   <sl-button variant="default" type="submit" class="profile__button" >
                                        <sl-icon slot="prefix" name="file-earmark-text"></sl-icon>
                                            Update
                                   </sl-button>
                                  
                                </div>
                           </div> 
                           

 

                               
                            <div class="chat__user">
                            
                                <figure>
                                </figure>
                                <div class="chat__name">
                                </div>
                                <div class="user__buttons">
                                    <button class="chat__button--logout">
                                         <sl-icon name="box-arrow-right" title="Logout" ></sl-icon>
                                    </button>
                                    <button class="chat__button--profile"  >
                                         <sl-icon name="gear" title="profile" ></sl-icon>
                                    </button>
                                </div>
                            </div>
                            <div class="chat__listusers">
                            </div>
                        </div>
                        <div class="chat__right">
                        </div>
                        <div class="chat__search">
                            <div class="search__header">
                                 <sl-icon-button name="x-circle" label="Close" class="search__close"></sl-icon-button> 
                                 <p> XX Messages </p>
                            </div>
                            <div class="search__input">
                                 <sl-input placeholder="Type here your search criteria" size="small" pill clearable>
                                       <sl-icon name="search" slot="prefix"></sl-icon>
                                 </sl-input>
                            </div>      
                            <div class="search__messages">
                            </div>
                        </div>
                </div>

                 
            `;
            this.htmlPage.innerHTML = htmlCode;
        }

        catch (error) {
            throw error;
        }
    }
    renderUserImage(DOMElement, url) {
        try {
            DOMElement.innerHTML = `
              <img src=${url} alt="memin"style="border-radius:50%;" />
              <sl-icon name="circle" style="background:#007E3F;border-radius:50%; color:#007E3F;width:0.5rem;height:0.5rem;position:absolute"  ></sl-icon>
           `;
        }
        catch (error) {
            throw error;
        }
    }
    renderUserNamePhrase(DOMElement, name,phrase) {
        try {
            DOMElement.innerHTML = `<h5>${name}</h5><h6>${phrase}</h6>`;
        }
        catch (error) {
            throw error;
        }
    }
}