import { State } from "./State.js";

import { DialogManager } from "../DialogManager.js";

export class SingleCharacterDialogState extends State
{
    async init(dialogId)
    {
        this.dialogManager = new DialogManager();

        this.dialogBox = await this.dialogManager.startDialog(dialogId);
    }

    async cleanup()
    {
        await this.dialogManager.clearDialogBox();
        
        await this.dialogManager.character.hide();
        
        this.dialogManager.characterManager.characterContainerElement.remove();
    }
}
