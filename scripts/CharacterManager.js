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
        console.log("retrieving character " + characterId);

        if (this.loadedCharacters.has(characterId))
            return this.loadedCharacters.get(characterId);

        if (characterId in characterData)
        {
            const newCharacter = new Character(characterData[characterId]);
            
            newCharacter.element.appendTo(this.characterContainerElement);
            
            return newCharacter;
        }
    
        console.error(characterId + " does not exist in characterData");
        return null;
    }
}
