import { Character        } from "./Character.js";
import { CharacterManager } from "./CharacterManager.js";

import { EnvironmentNavigationState } from "./states/EnvironmentNavigationState.js";

export class DialogManager
{
    constructor()
    {
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
        if (!$("#dialogBox").length)
            return;
        
        console.debug("Removing dialog box...");

        // remove the shown class and wait for the animation to finish
        $("#dialogBox").removeClass("shown");
        await sleep(500);

        // delete the element so it can be recreated later
        $("#dialogBox").remove();

        console.log("Dialog box removed.");
    }

    async startDialog(dialogId)
    {
        console.log("Starting dialog " + dialogId);

        this.dialog = game.dialogData[dialogId];

        if (this.character?.id != this.dialog.character)
        {
            // don't clear the dialog box unless it's for a different character.
            await this.clearDialogBox();

            if (this.character instanceof Character)
            {
                await this.character.hide(window.game.config.characterFadeTime);
                this.character = null;
            }
            
            this.character = this.characterManager.getCharacter(this.dialog.character);
        }
        else
            console.debug("Reusing character currently on screen");

        // only create new dialogbox if one does not exist
        let dialogBox = $("#dialogBox");

        if (!dialogBox.length)
            dialogBox = $(`<div id="dialogBox" class="bottom"><div class="dialog-owner">${this.character.name}</div></div>`).appendTo(document.body);

        if ("option" in this.dialog)
        {
            $("#dialogChoices").remove();

			this.dialogBoxChoiceContainer = $(`<div id="dialogChoices"></div>`).appendTo(dialogBox);
			
            for (const option of this.dialog.option)
            {
                const button = $(`<button class="dialog-button">${option.dialog}</button>`).appendTo(this.dialogBoxChoiceContainer);

                if ("next" in option)
                    button.click(async () => { await this.startDialog(option.next) });
                // TODO: button to go to a new scene

				console.debug("Added option to dialog box", option);
            }
        }
        else
        {
            $("#dialogText, #dialogButtons").remove();

			this.dialogBoxTextElement = $(`<div id="dialogText"></div>`).appendTo(dialogBox);
			
            this.dialogBoxButtonContainer = $(`<div id="dialogButtons" style="display: none;"></div>`).appendTo(dialogBox);
			
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
            dialogBox.addClass("shown");
        }, 0);

        await this.character.show(window.game.config.characterFadeTime);
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
            console.log("User requested to skip text animation");
            this.finishTextAnimation(); 
        });

        this.textAnimationInterval = setInterval(() =>
        {
            // if the temporary copy of the string is not empty
            if (this.dialog.tempTextCopy.length > 0)
            {
                // add the first character of the temp to the visible string
                this.dialogBoxTextElement.text(this.dialogBoxTextElement.text() + this.dialog.tempTextCopy.substr(2));
                // remove the first character from the temp
                this.dialog.tempTextCopy = this.dialog.tempTextCopy.slice(2);

                return;
            }

            this.finishTextAnimation();
        }, this.textAnimationTime);
    }

    finishTextAnimation()
    {
        clearInterval(this.textAnimationInterval);

        this.dialogBoxTextElement.text(this.dialog.dialog[this.dialog.currentDialog]);

        this.dialogBoxButtonContainer.show();
        $("#advanceDialog").focus();

        // TODO: I'd like to use namespaces or whatever to remove ONLY the event we added here, but this is what we have to do apparently. I have never been able to get namespaces to work.
        $(document).off("keydown");

        console.log("Text animation finished.");
    }

    async advanceDialog()
    {
        // I think this is to prevent player choice dialogs from being skipped
		if ("option" in this.dialog)
        {
            console.log("Ignoring request to advance dialog, it is a player choice box.");
			return;
        }

		console.log("Advancing dialog");
		
        this.dialogBoxButtonContainer.hide();
        
        // run through all dialog strings first, then show options or change state or whatever
        if (this.dialog.currentDialog >= this.dialog.dialog.length - 1)
        {
            console.log(`No more dialog remaining. (Current dialog: ${this.dialog.currentDialog} >= ${this.dialog.dialog.length - 1}`, this.dialog);

            if ("action" in this.dialog)
            {
                console.log("Dialog has action: ", this.dialog.action);
                
                // TODO: configure transition time from dialog data
                const newState = new EnvironmentNavigationState(this.dialog.action.environment);

                if (this.dialog.action.type == "changeEnvironment")
                    stateMachine.changeState(newState);
                else if (this.dialog.action.type == "pushEnvironment")
                    stateMachine.pushState(newState);
                else
                {
                    console.error("Dialog action type is invalid, popping state.");
                    stateMachine.popState();
                }

				return;
            }
            else if ("next" in this.dialog)
            {
                console.log(`Next dialog is ${this.dialog.next}.`);
                
                await this.startDialog(this.dialog.next);

				return;
            }
		    else
		    {
			    console.log("Dialog did not contain action directive, popping state.");
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
