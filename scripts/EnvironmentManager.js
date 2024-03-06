export class EnvironmentManager
{
    constructor()
    {
        this.environments = new Map();
        
        this.environmentContainerElement = $(`<div id="environments" style="display: none;">`).appendTo("body");
        
        this.environmentContainerElement.click((event) => 
        {
            event.preventDefault();
            event.stopPropagation();
            
            console.log("clicked in environment container");
            
            const hovering = $(".environment.hovering");

            if (hovering.length > 1)
            {
                console.warn("too many objects with hovering " + hovering.length);
                return;
            }
            
            hovering.click();
        });
    }
    
    async addEnvironment(environment, fadeTime = 3000)
    {
        this.environments.set(environment.id, environment);

        $("#environments").append(environment.element);
        $("#environments").fadeIn(fadeTime);
        
        // don't return until the fade is finished
        await sleep(fadeTime);
        
        console.log("added environment");
        
        return environment;
    }
    
    async clearEnvironments(fadeTime = 3000)
    {
        $(".environment").fadeOut(fadeTime);
            
        // wait until 
        await sleep(fadeTime);
        
        $("#environments").empty()

        this.environments.clear();
        
        console.log("cleared environments");
    }
    
    /*
    async changeEnvironment(environment, fadeTime = 3000)
    {
        this.environments[environment.id] = environment;

        if ($("#environments").children().length > 0)
            $("#environments").fadeOut(fadeTime);
        
        setTimeout(() => 
        {
            clearEnvironments();
            
            $("#environments").append(environment.element);
            
            $("#environments").fadeIn(fadeTime);
        }, fadeTime);
        
        return environment;
    }
    */
}