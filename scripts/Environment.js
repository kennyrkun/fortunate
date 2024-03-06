import { SingleCharacterDialogState } from "./states/SingleCharacterDialogState.js";

export class Environment
{
    constructor(environment)
    {
        this.environment = environment;
        this.id  = environment.id;
        this.src = `env${this.id}.png`;
        
        // TODO: load then append
        this.element = $(`<img src="images/env${this.id}.png" id="environment-${this.id}" class="environment">`);
        
        if ("click" in this.environment)
        {
            this.element.addClass("interactable");
            
            this.element.click((event) => {
                event.stopPropagation();
                
                if (!this.element.hasClass("hovering"))
                {
                    event.preventDefault();
                    return;
                }

                if (this.environment.click.action == "dialog")
                {
                    stateMachine.pushState(new SingleCharacterDialogState(
                        this.environment.click.character,
                        this.environment.click.dialog
                    ));
                }
            });
        }

        /*
        if (this.id == 2)
            this.element.append(`
                <map name="map${this.id}">
                    <area target="_blank" href="test1.html" onmouseover="console.log("hover 1");" onclick="console.log("click 1");" coords="150,590,37,544" shape="rect">
                </map>`);
        else if (this.id == 3)
            this.element.append(`
                <map name="map${this.id}">
                    <area target="_blank" href="test2.html" onmouseover="console.log("hover 2");" onclick="console.log("click 2");" coords="411,700,502,655,555,637,587,617,576,601,581,596,595,596,632,592,648,592,596,600,604,612,622,618,603,659,613,679,632,698" shape="poly">
                </map>`);
        */
    }
}