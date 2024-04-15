import { State } from "./State.js";

import { CharacterManager } from "../CharacterManager.js";
import { DialogManager } from "../DialogManager.js";

export class SingleCharacterDialogState extends State
{
    async init(dialogId, environmentId = null)
    {
        this.dialogManager = new DialogManager();
	await this.dialogManager.loadDialog();

        this.dialogBox = await this.dialogManager.startDialog(dialogId);
    }

    async cleanup()
    {
        await this.dialogManager.clearDialogBox();
        
        await this.dialogManager.character.hide();
        
        this.characterManager.characterContainerElement.remove();
    }
}
