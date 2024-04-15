import { CharacterManager } from "./CharacterManager.js";

export class DialogManager
{
    constructor()
    {
        this.dialogBoxElement         = null;
        this.dialogBoxTextElement     = null;
        this.dialogBoxButtonContainer = null;
        this.dialogBoxButton          = null;

        this.textAnimationTime     = 75;
        this.textAnimationInterval = null;

	this.characterManager = null;
        this.character        = null;
        
        this.dialog     = null;
        this.dialogData = null;
    }

    async loadDialog()
    {
        this.dialogData = await $.getJSON("./data/dialog.json");

        console.log("loaded dialog data", this.dialogData);

    	this.characterManager = new CharacterManager();
        await this.characterManager.loadCharacters();
    }

    async clearDialogBox()
    {
        if (this.dialogBoxElement === null)
            return;
            
        this.dialogBoxElement.removeClass("shown");

        await sleep(500);

        this.dialogBoxElement.remove();

        $(document).off('keydown', async () => { await this.advanceDialog(); });
    }

    async startDialog(dialogId)
    {
        console.log("load dialog");

        this.clearDialogBox();

        this.dialog = this.getDialog(dialogId);
	    
        this.character = this.characterManager.getCharacter(this.dialog.character);

        this.dialogBoxElement     = $(`<div class="dialog-box bottom" id="dialogBox"><div class="dialog-owner">${this.character.name}</div></div>`).appendTo(document.body);
        this.dialogBoxTextElement = $(`<div class="dialog-text"></div>`).appendTo(this.dialogBoxElement);

        if ("option" in this.dialog)
        {
            for (const option of this.dialog.option)
            {
                const button = $(`<button class="dialog-button">${option.dialog}</button>`).appendTo(this.dialogBoxButtonContainer);

                if ("next" in option)
                    button.click(async () => { await this.startDialog(option.next) });
                // TODO: button to go to a new scene
            }
        }
        else
        {
            this.dialogBoxButtonContainer = $(`<div id="dialogButtons" style="display: none;"></div>`).appendTo(this.dialogBoxElement);
            
            this.dialogBoxButton = $(`<button class="dialog-button">Next</button>`).appendTo(this.dialogBoxButtonContainer);
            this.dialogBoxButton.click(async () => { await this.advanceDialog(); });
            // TODO: put this on the dialog box itself, not the document
            // TODO: make this finish the text box instead of immediately sdkipping it
            $(document).keydown(async () => { await this.advanceDialog(); });
    
            this.dialog.currentDialog = 0;
            this.dialog.tempTextCopy = this.dialog.dialog[this.dialog.currentDialog];
    
            console.log("dialog is ready", this.dialog);
    
            setTimeout(() =>
            {
                this.startTextAnimation();
            }, 0);
        }

        setTimeout(() =>
        {
            this.dialogBoxElement.addClass("shown");
        }, 0);

        this.character.show();
    }

    startTextAnimation()
    {
		console.log("starting text animation");
	    
        this.textAnimationInterval = setInterval(() =>
        {
            if (this.dialog.tempTextCopy.length > 0)
            {
                this.dialogBoxTextElement.text(this.dialogBoxTextElement.text() + this.dialog.tempTextCopy[0]);
                this.dialog.tempTextCopy = this.dialog.tempTextCopy.slice(1);

                return;
            }

            clearInterval(this.textAnimationInterval);
            console.log("text animation finished");

            this.dialogBoxButtonContainer.show();
            this.dialogBoxButton.focus();
        }, this.textAnimationTime);
    }

    async advanceDialog()
    {
		if ("option" in this.dialog)
			return;

		console.log("advancing dialog")
		
        this.dialogBoxButtonContainer.hide();
        
        if (this.dialog.currentDialog >= this.dialog.dialog.length - 1)
        {
            console.log("dialog state is over", this.dialog);

            if ("action" in this.dialog)
            {
                console.log("checking dialog action");
                
                // TODO: configure transition time from dialog data
                const newState = new EnvrionmentNavigationState(this.dialog.action.environment);

                if (this.dialog.action.type == "changeEnvironment")
                    stateMachine.changeState(newState);
                else if (this.dialog.action.type == "pushEnvironment")
                    stateMachine.pushState(newState);
                else
                    console.error("dialog had action but it's type was invalid, popping state");
            }
            else if ("next" in this.dialog)
            {
                console.log("moving to next dialog" + this.dialog.next);
                
                // TODO: don't use this.character.id, instead, it should
                // use the character designated by the dialog data
                await this.startDialog(this.dialog.next);
            }
		    else
		    {
			    console.log("dialog has no action, popping state");
	            stateMachine.popState();
	            return;
	    	}
        }

        this.dialogBoxTextElement.empty();

        this.dialog.currentDialog += 1;
        this.dialog.tempTextCopy = this.dialog.dialog[this.dialog.currentDialog];

        this.startTextAnimation();
    }

    getDialog(dialogId)
    {
        return this.dialogData[dialogId];
    }
}
