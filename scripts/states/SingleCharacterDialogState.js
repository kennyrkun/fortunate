import { DialogManager } from "../DialogManager.js";
import { State } from "./State.js";

export class SingleCharacterDialogState extends State
{
    async init(characterId, dialogId, environmentId = null)
    {
        if (environmentId !== null)
        {
            await envMan.clearEnvironments();

            await envMan.addEnvironment(new Environment(environment));
        }

        this.character = characterManager.getCharacter(characterId);

        this.dialogManager = new DialogManager();
		await this.dialogManager.loadDialog();

        this.dialogBox = this.dialogManager.startDialog(dialogId, this.character);
        this.character.show();
    }

    async cleanup()
    {
        await this.dialogManager.clearDialogBox();
        
        await this.character.hide();
        
        characterManager.characterContainerElement.empty();
    }
}
