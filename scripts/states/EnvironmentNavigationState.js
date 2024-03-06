import { State } from "./State.js";

import { Environment } from "../Environment.js";

export class EnvironmentNavigationState extends State
{
    init(environments)
    {
        envMan.clearEnvironments();
        
        for (let environment of environments)
            envMan.addEnvironment(new Environment(environment));
            
        console.log("added environments to navigation state");
    }
}