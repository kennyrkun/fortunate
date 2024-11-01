import { State } from "./State.js";

import { Environment } from "../Environment.js";
import { EnvironmentManager } from "../EnvironmentManager.js";

// TODO: rename this to EnvironmentState
export class EnvironmentNavigationState extends State
{
    async init(environmentName, fadeTime = 3000)
    {
        this.envMan = new EnvironmentManager();

        // TODO: do not apply this when unused
        this.envMan.environmentContainerElement.addClass("navigation");

        // store just the specific environment we want to use
        this.environmentData = game.environmentData[environmentName];

        // add the background first
        this.envMan.addEnvironment(new Environment(
            this.environmentData.directory,
            this.environmentData.background,
            {}
        ), fadeTime);

        // isn't specificially to add interactables, but that's what it does
        for (const [name, attributes] of Object.entries(this.environmentData.interactables))
            this.envMan.addEnvironment(new Environment(
                this.environmentData.directory,
                name, 
                attributes
            ), fadeTime);
        
        console.log(this.envMan);

        // wait for environment to finish fading before registering event listeners
        await this.envMan.show(fadeTime);
        
        this.registerEventListeners();
        
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
        
        console.log("paused EnvironmentNavigationState");
    }

    async resume()
    {
        this.registerEventListeners();

        await this.envMan.show();
        
        console.log("resumed EnvironmentNavigationState");
    }

    // TODO: support scaled images
    getPixel(img, x, y) 
    {
        // TODO: don't make a new canvas every time
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
            if ("click" in environment.attributes)
                environment.element.toggleClass("hovering", this.getPixel(environment.element[0], event.clientX, event.clientY)[3] > 0);
    }
}
