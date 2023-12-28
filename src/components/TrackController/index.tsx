import {   ChevronLeft, ChevronRight, Volume1, Volume2 } from '@geist-ui/icons'
// import { Button } from '@geist-ui/icons'

import Slider from 'preact-material-components/Slider';
import {set_vol} from '../../api/Backend_Api_call';
// import { an } from 'vitest/dist/reporters-5f784f42.js';




const TrackController  = ({toggleVisibility}:any)=>{
    return (
        <div class="controller">
        <button className={"focus_scale-2"}>
            <ChevronLeft size="40"></ChevronLeft>
        </button>

        <div onClick={toggleVisibility} id={"running_track"} className={"focus_scale"} style="width:100%; text-align: center;">Opera Gx KeySound</div>

        <button className={"focus_scale-2"}>
            <ChevronRight size="40"></ChevronRight>
        </button>
        <button>
            <Volume1></Volume1>
        </button>
        <div style="width:100%; "  >
            <Slider onInput={(Number: any) => {
                set_vol(Number.target.getAttribute("aria-valuenow"));
            }} step={2} value={10} max={100} />
        </div>
        <button>
            <Volume2></Volume2>
        </button>
    </div>
    );
};


export default TrackController;