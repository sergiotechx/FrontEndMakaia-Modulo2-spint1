export class LoginRender{
   
    constructor(_htmlPage){
        this.htmlPage = _htmlPage;
    }
   
    render(){
        try{
            let htmlCode = 
           `
            <header class="login__header">
                <sl-icon name="person"></sl-icon>
                <h3>User Session</h3>
            </header>
        <div class="loginregister__container">
        <sl-divider style="--color:#075E54;" ></sl-divider>
       
        <sl-tab-group>
            <sl-tab slot="nav" panel="Login">Login</sl-tab>
            <sl-tab slot="nav" panel="Register">Register</sl-tab>
            <sl-tab-panel name="Login">
                <form id="form__login">
                    <fieldset id="fieldset">
                        <legend>Login data</legend>
                        <sl-input label="Cell Number" placeholder="Cell Number" size="medium" pill required >
                            <sl-icon name="telephone" slot="prefix"></sl-icon>
                        </sl-input>
                        <sl-input label="Password" type="password" placeholder="Password" size="medium" pill password-toggle required>
                            <sl-icon name="key" slot="prefix"></sl-icon>
                        </sl-input>
                        <sl-button variant="default" type="submit" class="form__button"  >
                            <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
                                Login
                        </sl-button>
                        </fieldset>
                </form>
            </sl-tab-panel>
            <sl-tab-panel name="Register">
                <form id="form__register">
                    <fieldset id="fieldset">
                        <legend>Registration Data</legend>
                        <sl-input label="Full Name" placeholder="Full Name" size="medium" pill required>
                            <sl-icon name="person" slot="prefix"></sl-icon>
                        </sl-input>
                        <sl-input label="Cell Number" placeholder="Cell Number" size="medium" pill required>
                            <sl-icon name="telephone" slot="prefix"></sl-icon>
                        </sl-input>
                        <sl-input label="Password" type="password" placeholder="Password" size="medium" pill password-toggle required>
                            <sl-icon name="key" slot="prefix"></sl-icon>
                        </sl-input>
                        <sl-input label="Repeat Password" type="password" placeholder="Repeat Password" size="medium" pill password-toggle required>
                            <sl-icon name="key" slot="prefix"></sl-icon>
                        </sl-input>
                        <sl-input label="Image URL" type="url" placeholder="Image URL" size="medium" pill required  >
                            <sl-icon name="person-bounding-box" slot="prefix"></sl-icon>
                        </sl-input>
                        <sl-input label="Phrase" type="text" placeholder="Phrase" size="medium" pill required  >
                            <sl-icon name="file-text" slot="prefix"></sl-icon>
                        </sl-input>
                        <sl-button variant="default" type="submit" class="form__button">
                            <sl-icon slot="prefix" name="file-earmark-text"></sl-icon>
                                Save
                        </sl-button>
                        <sl-button variant="default" type="reset" class="form__button">
                            <sl-icon slot="prefix" name="x-circle"></sl-icon>
                                Reset
                        </sl-button>
                        </fieldset>
                </form>
            </sl-tab-panel>
        </sl-tab-group>
        </div>
           `;
           this.htmlPage.innerHTML = htmlCode;
        }
        catch(error){
            throw error;
        }
    }
}