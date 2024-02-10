import { invoke } from "@tauri-apps/api/tauri";
import { BaseDirectory, writeTextFile, readDir, readTextFile,createDir } from '@tauri-apps/api/fs';



interface Track_data {
    name: string,
    path: string
};









export async function set_vol(volume: Number) {
    console.log(`Volume${volume}`);

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke("set_vol", { vol: `${volume}` }).then((message) => {
        console.log(message)
    }).catch((n) => {
        console.log(n);
    });
}




export async function set_track(track_path: string) {
    console.log(`track_path ${track_path}`);

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke("set_track", { arg: `${track_path}` }).then((message) => {
        console.log(message)
    }).catch((n) => {
        console.log(n);
    });
}




export async function intialising_sound_track_data() {
    const files = await readDir('soundPack/', { dir: BaseDirectory.Resource });
    
    let json: Track_data[] = [];
    files.forEach(track => {
        let tr: Track_data = { name: track.name!, path: track.path! };
        json.push(tr);
    });
    await createDir('users', { dir: BaseDirectory.AppData, recursive: true });

    return await writeTextFile('app_data.json', JSON.stringify(json), { dir: BaseDirectory.AppData });

}


export async function checking_Sound_track_data() {
    readTextFile('app_data.json', { dir: BaseDirectory.AppData }).catch(() => {
        intialising_sound_track_data();
    });
}

export async function handleFolderSelection() {

    invoke("add_track").then((message: unknown) => {

        if (typeof message == "string") {
            interface ApiResponse {
                success: Boolean,
                data?: string | null,
                error?: string | null
            };

            let responce: ApiResponse = JSON.parse(message);
            if (responce.success) {
                Save_SoundTrack(getFileNameFromPath(responce.data!), responce.data!);
                set_track(responce.data!);
            }
        } else {
            console.error("Unexpected message type:", typeof message);
        }






    }).catch((n) => {
        console.log(n);
    });


};


export async function Save_SoundTrack(Soundtrack_Name: string, Soundtrack_Path: string) {
    let data = await readTextFile('app_data.json', { dir: BaseDirectory.AppData });
    console.log(data);

    let tracks: Track_data[] = JSON.parse(data);

    const existingIndex = tracks.findIndex(track => track.path === Soundtrack_Path || track.name === Soundtrack_Name);

    if (existingIndex !== -1) {
        // If it exists, remove that track from the data
        tracks.splice(existingIndex, 1);
    }

    // add the new soundtrack at the first position
    tracks.unshift({ name: Soundtrack_Name, path: Soundtrack_Path });


    await writeTextFile('app_data.json', JSON.stringify(tracks), { dir: BaseDirectory.AppData });
}




interface option_structure {
    label: string,
    value: string
}

export async function GetTrackData(): Promise<option_structure[]> {

    let data = await readTextFile('app_data.json', { dir: BaseDirectory.AppData });
    let tracks: Track_data[] = JSON.parse(data);






    const convertTracksToOptions = (tracks: Track_data[]): option_structure[] => {
        return tracks.map(track => ({
            label: track.name,
            value: track.path
        }));
    };
    return convertTracksToOptions(tracks);
}


export function getFileNameFromPath(filePath: string): string {
    // Use a regular expression to match the file name at the end of the path
    let splited_path = [];
    if (filePath.match("/")) {
        splited_path = filePath.split('/');
    } else {
        splited_path = filePath.split("\\");
    };
    var name = splited_path[splited_path.length - 1];
    if (!name) {
        name = splited_path[splited_path.length - 2];
    }



    // If there's a match, return the captured group (file name), otherwise return null
    return name;
}          