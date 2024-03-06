import { Character } from "./Character.js";

export class CharacterManager
{
    constructor()
    {
        this.loadedCharacters = new Map();
        this.characterData = null;
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

        return new Character(this.characterData[characterId]);
    }
}