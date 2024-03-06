export class EnvironmentManager
{
    constructor()
    {
        this.environments = new Map();
        
        this.environmentContainerElement = $(`<div class="environment-container" style="display: none;">`).appendTo("body");
    }
    
    addEnvironment(environment)
    {
        this.environments.set(environment.id, environment);

        this.environmentContainerElement.append(environment.element);
        
        console.log("added environment");
        
        return environment;
    }
    
    // fade the environments and then clear them
    async clearEnvironments(fadeTime = 2000)
    {
        await this.hide();
        
        this.environmentContainerElement.empty()

        this.environments.clear();
        
        console.log("cleared environments");
    }
    
    async hide(fadeTime = 2000)
    {
        console.log("hiding environment");

        this.environmentContainerElement.fadeOut(fadeTime);

        await sleep(fadeTime);
    }

    async show(fadeTime = 2000)
    {
        console.log("showing environment");

        this.environmentContainerElement.fadeIn(fadeTime);

        await sleep(fadeTime);
    }
}