import { State } from "./State.js";

import { Environment } from "../Environment.js";

export class EnvironmentNavigationState extends State
{
    async init(environments, fadeTime = 3000)
    {
        envMan.clearEnvironments();

        envMan.environmentContainerElement.addClass("navigation");
        
        for (let environment of environments)
            envMan.addEnvironment(new Environment(environment), fadeTime);
            
        console.log("added environments to navigation state");
    }

    async cleanup()
    {
        await envMan.clearEnvironments();

        envMan.environmentContainerElement.removeClass("navigation");
    }
}