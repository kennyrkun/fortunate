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

        // TODO: remove the global dialog manager and create a new one locally in the state
        window.dialogManager = new DialogManager();
        await dialogManager.loadDialog();

        this.dialogBox = dialogManager.startDialog(dialogId, this.character);
    }

    async cleanup()
    {
        await dialogManager.clearDialogBox();

        await this.character.hide();
    }
}