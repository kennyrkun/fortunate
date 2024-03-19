export class DialogManager
{
    constructor()
    {
        this.dialogBoxElement         = null;
        this.dialogBoxTextElement     = null;
        this.dialogBoxButtonContainer = null;
        this.dialogBoxButton          = null;

        this.textAnimationTime = 75;
        this.textAnimationInterval = null;

        this.character = null;
        this.dialog    = null;

        this.dialogData = null;
    }

    async loadDialog()
    {
        this.dialogData = await $.getJSON("./data/dialog.json");

        console.log("loaded dialog data", this.dialogData);
    }

    async clearDialogBox()
    {
        if (this.dialogBoxElement === null)
            return;
            
        this.dialogBoxElement.removeClass("shown");

        await sleep(500);

        this.dialogBoxElement.remove();
    }

    startDialog(dialogId, character)
    {
        console.log("load dialog");

        this.clearDialogBox();

        this.dialog = this.getDialog(dialogId);

        this.dialogBoxElement     = $(`<div class="dialog-box bottom" id="dialogBox"><div class="dialog-owner">${character.name}</div></div>`).appendTo(document.body);
        this.dialogBoxTextElement = $(`<div class="dialog-text"></div>`).appendTo(this.dialogBoxElement);

        this.dialogBoxButtonContainer = $(`<div id="dialogButtons" style="display: none;"></div>`).appendTo(this.dialogBoxElement);
        
        this.dialogBoxButton = $(`<button class="dialog-button">Next</button>`).appendTo(this.dialogBoxButtonContainer);
        this.dialogBoxButton.click(() => { this.advanceDialog(); });

        this.dialog.currentDialog = 0;
        this.dialog.tempTextCopy = this.dialog.dialog[this.dialog.currentDialog];

        console.log("dialog is ready", this.dialog);

        setTimeout(() =>
        {
            this.dialogBoxElement.addClass("shown");

            this.startTextAnimation();
        }, 0);
    }

    startTextAnimation()
    {
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

    advanceDialog()
    {
        this.dialogBoxButtonContainer.hide();
        
        if (this.dialog.currentDialog >= this.dialog.dialog.length - 1)
        {
            console.log("dialog state is over");

            if ("action" in this.dialog.dialog)
            {
                // TODO: configure transition time from dialog data
                const newState = new EnvrionmentNavigationState(this.dialog.dialog.action.environment);

                if (this.dialog.dialog.action.type == "changeEnvironment")
                    stateMachine.changeState(newState);
                else if (this.dialog.dialog.action.type == "pushEnvironment")
                    stateMachine.pushState(newState);
            }

            stateMachine.popState();
            return;
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
