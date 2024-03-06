export class StateMachine
{
    constructor()
    {
        this.states = [];
        
        console.log("StateMachine is ready.");
    }
    
    cleanup()
    {
        for (let state of this.states)
        {
            state.cleanup();
            state = null;
        }
        
        this.states.length = 0;
        
        console.log("StateMachine is cleaned up.");
    }
    
    async pushState(state)
    {
        this.states[this.states.length - 1]?.pause();
            
        state.stateMachine = this;
        this.states.push(state);
    
        console.log("StateMachine: Initialising " + state.constructor.name + "...");
        await state.init.apply(state, state.constructorArgs);
        console.log("StateMachine: Finished initialising " + state.constructor.name + ".");
    
        $("#debug-state").text(state.constructor.name);
    }
    
    async popState()
    {
        const state = this.states[this.states.length - 1];
    
        console.log("StateMachine: Cleaning up " + state.constructor.name + "...");
        await state.cleanup();
        console.log("StateMachine: Cleaned up " + state.constructor.name + ".");
    
        this.states.pop();
        
        this.states[this.states.length - 1]?.resume();
            
        console.log("StateMachine: Popped state.");
    }
    
    async changeState(state)
    {
        await this.popState();
        await this.pushState(state);
        
        console.log("Changed state.");
    }
}