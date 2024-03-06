import { DialogManager } from "../DialogManager.js";
import { State } from "./State.js";

export class SingleCharacterDialogState extends State
{
    async init(characterId, dialogId, environmentId = null)
    {
	this.characterManager = new CharacterManager();
	await this.characterManager.loadCharacters();
	    
        this.character = this.characterManager.getCharacter(characterId);

        this.dialogManager = new DialogManager();
	await this.dialogManager.loadDialog();

        this.dialogBox = this.dialogManager.startDialog(dialogId, this.character);
        this.character.show();
    }

    async cleanup()
    {
        await this.dialogManager.clearDialogBox();
        
        await this.character.hide();
        
        this.characterManager.characterContainerElement.remove();
    }
}
