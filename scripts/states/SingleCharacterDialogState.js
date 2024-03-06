import { State } from "./State.js";

export class SingleCharacterDialogState extends State
{
    init(characterId, dialogId)
    {
        this.character = new Character(characterId);
        this.dialogBox = new DialogBox(dialogId);
        
        this.character.show();
        this.dialogBox.show();
    }
}