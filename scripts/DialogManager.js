import { Character        } from "./Character.js";
import { CharacterManager } from "./CharacterManager.js";

import { EnvironmentNavigationState } from "./states/EnvironmentNavigationState.js";

export class DialogManager
{
    constructor()
    {
        this.dialogBoxElement         = null;
        this.dialogBoxTextElement     = null;
        this.dialogBoxButtonContainer = null;
		this.dialogBoxChoiceContainer = null;

        this.textAnimationTime     = 75;
        this.textAnimationInterval = null;

	    this.characterManager = null;
        this.character        = null;
        
        this.dialog = null;

        this.characterManager = new CharacterManager();
    }

    async clearDialogBox()
    {
        if (this.dialogBoxElement === null)
            return;
        
        // remove the shown class and wait for the animation to finish
        this.dialogBoxElement.removeClass("shown");
        await sleep(500);

        // delete the element so it can be recreated later
        this.dialogBoxElement.remove();

        // remove the advance dialog hotkey from the document
        $(document).off("keydown", () => { this.finishTextAnimation(); });
    }

    async startDialog(dialogId)
    {
        console.log("Starting dialog " + dialogId);

        this.clearDialogBox();

        this.dialog = game.dialogData[dialogId];

        if (this.character?.id != this.dialog.character)
        {
            if (this.character instanceof Character)
            {
                await this.character.hide(1000);
                this.character = null;
            }
            
            this.character = this.characterManager.getCharacter(this.dialog.character);
        }
        else
            console.log("Reusing character currently on screen");

        this.dialogBoxElement = $(`<div class="dialog-box bottom" id="dialogBox"><div class="dialog-owner">${this.character.name}</div></div>`).appendTo(document.body);

        if ("option" in this.dialog)
        {
			this.dialogBoxChoiceContainer = $(`<div class="dialog-choices"></div>`).appendTo(this.dialogBoxElement);
			
            for (const option of this.dialog.option)
            {
                const button = $(`<button class="dialog-button">${option.dialog}</button>`).appendTo(this.dialogBoxChoiceContainer);

                if ("next" in option)
                    button.click(async () => { await this.startDialog(option.next) });
                // TODO: button to go to a new scene

				console.log("added option to dialog box", option);
            }
        }
        else
        {
			this.dialogBoxTextElement = $(`<div class="dialog-text"></div>`).appendTo(this.dialogBoxElement);
			
            this.dialogBoxButtonContainer = $(`<div id="dialogButtons" style="display: none;"></div>`).appendTo(this.dialogBoxElement);
			
            const dialogBoxButton = $(`<button id="advanceDialog">Next</button>`).appendTo(this.dialogBoxButtonContainer);
            dialogBoxButton.click(async () => { console.log("advance button clicked"); await this.advanceDialog(); });
    
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

        await this.character.show(1000);
    }

    startTextAnimation()
    {
        console.log("starting text animation");
	    
        clearInterval(this.textAnimationInterval);

        // TODO: put this on the dialog box itself, not the document
        // TODO: make this finish the text box instead of immediately sdkipping it
        // add a hotkey to the window to skip the current dialog
        $(document).on("keydown", (event) => { 
            event.preventDefault();
            event.stopPropagation();
            this.finishTextAnimation(); 
        });

        this.textAnimationInterval = setInterval(() =>
        {
            // if the temporary copy of the string is not empty
            if (this.dialog.tempTextCopy.length > 0)
            {
                // add the first character of the temp to the visible string
                this.dialogBoxTextElement.text(this.dialogBoxTextElement.text() + this.dialog.tempTextCopy[0]);
                // remove the first character from the temp
                this.dialog.tempTextCopy = this.dialog.tempTextCopy.slice(1);

                return;
            }

            this.finishTextAnimation();
        }, this.textAnimationTime);
    }

    finishTextAnimation()
    {
        console.log("Finished text animation.");

        clearInterval(this.textAnimationInterval);

        this.dialogBoxTextElement.text(this.dialog.dialog[this.dialog.currentDialog]);

        this.dialogBoxButtonContainer.show();
        $("#advanceDialog").focus();

        // TODO: I'd like to use namespaces or whatever to remove ONLY the event we added here, but this is what we have to do apparently. I have never been able to get namespaces to work.
        $(document).off("keydown");
    }

    async advanceDialog()
    {
        // I think this is to prevent player choice dialogs from being skipped
		if ("option" in this.dialog)
			return;

		console.log("advancing dialog")
		
        this.dialogBoxButtonContainer.hide();
        
        // run through all dialog strings first, then show options or change state or whatever
        if (this.dialog.currentDialog >= this.dialog.dialog.length - 1)
        {
            console.log("dialog state is over", this.dialog);

            if ("action" in this.dialog)
            {
                console.log("checking dialog action");
                
                // TODO: configure transition time from dialog data
                const newState = new EnvironmentNavigationState(this.dialog.action.environment);

                if (this.dialog.action.type == "changeEnvironment")
                    stateMachine.changeState(newState);
                else if (this.dialog.action.type == "pushEnvironment")
                    stateMachine.pushState(newState);
                else
                    console.error("dialog had action but it's type was invalid, popping state");

				return;
            }
            else if ("next" in this.dialog)
            {
                console.log("moving to next dialog" + this.dialog.next);
                
                // TODO: don't use this.character.id, instead, it should
                // use the character designated by the dialog data
                await this.startDialog(this.dialog.next);

				return;
            }
		    else
		    {
			    console.log("dialog has no action, popping state");
			    stateMachine.popState();
			    return;
			}
        }

        // play the next dialog string
        this.dialogBoxTextElement.empty();

        this.dialog.currentDialog += 1;
        this.dialog.tempTextCopy = this.dialog.dialog[this.dialog.currentDialog];

        this.startTextAnimation();
    }
}
