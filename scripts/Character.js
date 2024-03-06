export class Character
{
    constructor(characterId)
    {
        this.id = characterId;
        
        this.element = $(`<img src="chr${this.id}.png" id="character${this.id}" class="character" style="display: none">`).appendTo("#characters");
    }

    show(fadeTime = 3000)
    {
        element.fadeIn(fadeTime);
    }

    hide(fadeTime = 3000)
    {
        element.fadeOut(fadeTime);
    }
}