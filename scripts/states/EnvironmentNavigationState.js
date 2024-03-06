import { State } from "./State.js";

import { Environment } from "../Environment.js";
import { EnvironmentManager } from "../EnvironmentManager.js";

export class EnvironmentNavigationState extends State
{
    async init(environments, fadeTime = 3000)
    {
        this.envMan = new EnvironmentManager();

        this.envMan.environmentContainerElement.addClass("navigation");

        this.registerEventListeners();

        for (let environment of environments)
            this.envMan.addEnvironment(new Environment(environment), fadeTime);

        this.envMan.show(fadeTime);
            
        console.log("added environments to navigation state");
    }

    async cleanup()
    {
        await this.envMan.clearEnvironments();
    }

    async pause()
    {
        this.removeEventListeners();
        
        this.envMan.environmentContainerElement.find(".environment").removeClass("hovering");
        
        console.log(this.envMan.environmentContainerElement.find(".environment"));
        
        await this.envMan.hide();
        
        console.log("paused environmentnavigationstate");
    }

    async resume()
    {
        this.registerEventListeners();

        await this.envMan.show();
        
        console.log("resumed environmentnavigationstate");
    }

    // TODO: support scaled images
    getPixel(img, x, y) 
    {
        // don't make a new canvas every time
        let canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        canvas.getContext('2d').drawImage(img, x, y, 1, 1, 0, 0, 1, 1);;
        let pixelData = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;
        canvas.remove();

        return pixelData;
    }

    registerEventListeners()
    {
        this.envMan.environmentContainerElement.on("click", (event) => 
        {
            event.preventDefault();
            event.stopPropagation();
            
            console.log("clicked in environment container");
            
            const hovering = this.envMan.environmentContainerElement.find(".hovering");

            if (hovering.length > 1)
            {
                console.warn("too many objects with hovering " + hovering.length);
                return;
            }
            
            hovering.click();
        });

        $(this.envMan.environmentContainerElement).on("mousemove", (event) => { this.onMouseMove(event) });

        console.log("added event listeners to environmentnavigationstate");
    }

    removeEventListeners()
    {
        // TODO: remove this class's specific listeners only
        
        $(this.envMan.environmentContainerElement).off("mousemove");
        $(this.envMan.environmentContainerElement).off("click");

        console.log("removed event listeners from environmentnavigationstate");
    }

    onMouseMove(event)
    {
        for (const environment of this.envMan.environments.values())
        {
            if ("click" in environment.environment)
            {
                environment.element.toggleClass("hovering", this.getPixel(environment.element[0], event.clientX, event.clientY)[3] > 0);
            }
        }
    }
}
