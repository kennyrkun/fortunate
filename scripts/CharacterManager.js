import { Character } from "./Character.js";

export class CharacterManager
{
    constructor()
    {
        this.loadedCharacters = new Map();
        
        this.characterContainerElement = $(`<div id="characterContainer"></div>`).appendTo(document.body);
    }

    getCharacter(characterId)
    {
        console.log(`Creating character ${characterId}.`);

        if (this.loadedCharacters.has(characterId))
            return this.loadedCharacters.get(characterId);

        if (characterId in game.characterData)
        {
            const newCharacter = new Character(game.characterData[characterId]);
            
            newCharacter.element.appendTo(this.characterContainerElement);
            
            return newCharacter;
        }
    
        console.error(`${characterId} does not exist in characterData.`);
        return null;
    }
}
