import { AutoComplete, } from "@geist-ui/core";
import React from "preact/compat";
import { GetTrackData, set_track, getFileNameFromPath ,Save_SoundTrack} from "../../api/Backend_Api_call";


interface option_structure {
    label: string, value: string
}
const SearchTrackBar = ({ isVisible, toggleVisibility }:any) => {



    var allOptions: option_structure[] = [];

    const [options, setOptions] = React.useState<option_structure[]>()


    const searchHandler = async (currentValue: string) => {
        allOptions = await GetTrackData();
        if (!currentValue) return setOptions(allOptions)
        const relatedOptions = allOptions.filter(item => item.label.toLowerCase().includes(currentValue.toLowerCase()))
        setOptions(relatedOptions)
    }


    const Set_Track = (track: string) => {
        set_track(track);
        Save_SoundTrack( getFileNameFromPath(track),track);


        console.log(isVisible);
        const running_track = document.getElementById('running_track') as HTMLElement;
        running_track.innerText = getFileNameFromPath(track);
        toggleVisibility()
    };



    setTimeout(() => {
        document.getElementById("Searach_input_element")?.focus()
    }, 10);




    return (
        <div id="SearchTrackBar">
            <AutoComplete id="Searach_input_element" autofocus hidden={!isVisible} disableFreeSolo options={options} placeholder="Enter here" onSearch={searchHandler} width="100%" onSelect={Set_Track} />
        </div>
    )
};

export default SearchTrackBar;



