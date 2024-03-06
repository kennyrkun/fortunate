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
        this.dialogBox = dialogManager.startDialog(dialogId, this.character);
    }

    async cleanup()
    {
        await this.character.hide();
    }
}