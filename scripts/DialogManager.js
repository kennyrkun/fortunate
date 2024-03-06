export class DialogManager
{
    constructor()
    {
        this.dialogBoxElement = null;

        this.character = null;
        this.dialog    = null;

        this.dialogData = null;
    }

    async loadDialog()
    {
        this.dialogData = await $.getJSON("./data/dialog.json");

        console.log("loaded dialog data", this.dialogData);
    }

    clearDialogBox()
    {
        $("#dialogBox").remove();
    }

    startDialog(dialogId, character)
    {
        console.log("load dialog");

        this.clearDialogBox();

        const dialog = this.getDialog(dialogId);

        this.dialogBoxElement = $(`<div class="dialog-box bottom" id="dialogBox"><div class="dialog-owner">${character.name}</div><div class="">${dialog}</div></div>`).appendTo(document.body);

        console.log("dialog is ready");

        setTimeout(() =>
        {
            this.dialogBoxElement.addClass("shown");
        }, 0);
    }

    getDialog(dialogId)
    {
        return this.dialogData[dialogId];
    }
}