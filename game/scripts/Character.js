export class Character
{
    constructor(character)
    {
        console.log("creating character", character);

        this.id = character.id;
        this.name = character.name;

        this.element = $(`<img src="${window.location.href}game/images/characters/${this.id}.png" id="character${this.id}" class="character" style="display: none">`);
    }

    async show(fadeTime = window.game.config.characterFadeTime)
    {
        await this.element.fadeIn(fadeTime);
    }

    async hide(fadeTime = window.game.config.characterFadeTime)
    {
        this.element.fadeOut(fadeTime);
        
        await sleep(fadeTime);
    }
}
