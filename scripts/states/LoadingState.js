import { State } from "./State.js";

import { addStyle, removeStyle } from "../PageUtility.js";

import { EnvironmentNavigationState } from "./EnvironmentNavigationState.js";

export class LoadingState extends State
{
    init()
    {
        addStyle("LoadingState");

        $("body").prepend(
            `<div id='loadingCover'>
                <!--
                <div id='logoContainer'>
                    <img id='kerris' src='https://kerrishaus.com/assets/logo/text-big.png'></img>
                </div>
                 -->
                <div id='progressContainer'>
                    <progress id="progress"></progress>
                    <h1 id="progressText">Preparing...</h1>
                </div>
                <div id='help'>
                    <div>
                        <div>Copyright &copy; 2024</div>
                        <div>Kerris Haus</div>
                        <div>
                            <a href="https://emmakocialskiportfolio.weebly.com/">
                                Emma Kocialski aka Huntress/a_bunny790
                            </a>
                        </div>
                        <div>Chris ._.</div>
                    </div>
                </div>
             </div>`
        );
        
        //window.addEventListener('DOMContentLoaded', async () =>
        setTimeout(async () =>
        {
            $("#progressText").text("Beginning");

            new Promise(async (resolve) =>
            {
                $("#progress").attr("max", 4);

                window.game = {};

                // TODO: have every model loaded automatically
                $("#progressText").text("Loading dialog");
                window.game.dialogData = await $.getJSON("./data/dialog.json");
                $("#progress").attr("value", 1);

                $("#progressText").text("Loading characters");
                window.game.characterData = await $.getJSON("./data/characters.json");
                $("#progress").attr("value", 2);

                $("#progressText").text("Loading environments");
                window.game.environmentData = await $.getJSON("./data/environments.json");
                $("#progress").attr("value", 3);

                $("#progressText").text("Loading game configuration");
                window.game.config = await $.getJSON("./data/environments.json");
                $("#progress").attr("value", 4);

                resolve(true);
            }).then(() =>
            {
                console.log("Loading is complete.");
                $("#progressText").text("Ready!");
                this.stateMachine.popState();
            });
        }, 1000);
    }
    
    cleanup()
    {
        setTimeout(() => {
            // load the new state first so that all the assets are loaded
            // and we don't get super bad popping
            stateMachine.pushState(new EnvironmentNavigationState("oafmound_start", 0));
    
            $("#loadingCover").fadeOut(1000, function() {
                $(this).remove(); 
                removeStyle("LoadingState");
            });
        }, 1000);
    }
};
