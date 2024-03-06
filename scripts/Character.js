export class Character
{
    constructor(character)
    {
        console.log("creating character", character);

        this.id = character.id;
        this.name = character.name;

        this.element = $(`<img src="images/chr${this.id}.png" id="character${this.id}" class="character" style="display: none">`);
    }

    async show(fadeTime = 2000)
    {
        await this.element.fadeIn(fadeTime);
    }

    async hide(fadeTime = 2000)
    {
        this.element.fadeOut(fadeTime);
        
        await sleep(fadeTime);
    }
}
