import { Button} from '@geist-ui/core';


import "./styles.css";
import "./App.css";


import { Github, Power,  Search } from '@geist-ui/icons'

import 'preact-material-components/Slider/style.css';

import FolderSelectionButton from "./components/FolderSelectionButton";
import TrackController from "./components/TrackController";
import  { useState } from 'preact/compat';
import  SearchTrackBar  from "./components/SearchBar";


// import { as } from 'vitest/dist/reporters-5f784f42.js';






 


export default function AppComponent() {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        console.log("change");
        
        setIsVisible(!isVisible);
      };
      


    return (
        
        <main>
            <header >
                <Button iconRight={<Search/>} auto scale={2 / 3}  onClick={toggleVisibility} />
                <div class="header-menu-right-side" >
                    <Button iconRight={<Github />} auto scale={2 / 3} px={0.6} />
                    <Button style="  " iconRight={<Power />} auto scale={2 / 3} px={0.6} />
                </div>
            {isVisible &&  <SearchTrackBar isVisible={isVisible} toggleVisibility={toggleVisibility}  ></SearchTrackBar>}
            </header>
           

            <div id="main-wrapper"  >
                <div id="mackTunes-box" >
                    <text id="mackTunes-text">MackTunes</text>
                </div>
            </div>

            <TrackController toggleVisibility={toggleVisibility} ></TrackController>
          

            <FolderSelectionButton></FolderSelectionButton>
        </main>
    );
}
