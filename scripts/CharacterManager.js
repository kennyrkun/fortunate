import { Character } from "./Character.js";

export class CharacterManager
{
    constructor()
    {
        this.loadedCharacters = new Map();
        this.characterData = null;
        
        this.characterContainerElement = $(`<div id="characterContainer"></div>`).appendTo(document.body);
    }

    async loadCharacters()
    {
        this.characterData = await $.getJSON("./data/characters.json");

        console.log("loaded character data", this.characterData);
    }

    getCharacter(characterId)
    {
        console.log("retrieving character " + characterId);

        if (this.loadedCharacters.has(characterId))
            return this.loadedCharacters.get(characterId);

        if (characterId in this.characterData)
        {
            const newCharacter = new Character(this.characterData[characterId]);
            
            newCharacter.element.appendTo(this.characterContainerElement);
            
            return newCharacter;
        }
    
        console.error(characterId + " does not exist in characterData");
        return null;
    }
}
