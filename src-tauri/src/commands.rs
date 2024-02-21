use crate::ApiResponse;
pub use crate::AsyncProcInputTx;
use crate::UserChangeAction;
use serde::{Deserialize, Serialize};
use tauri::api::dialog::FileDialogBuilder;
use tauri::api::dir::{is_dir, read_dir};


fn remove_prefix(path_str: &str) -> &str {
    if let Some(stripped) = path_str.strip_prefix(r"\\?\") {
        stripped
    } else {
        // If the prefix is not present, return the original string
        path_str
    }
}

#[tauri::command]
pub async fn set_track(
    arg: &str,
    state: tauri::State<'_, AsyncProcInputTx>,
) -> Result<String, String> {
    let batman = state.inner.lock().await;
    //  // println!("arg:{}",arg);
    let resss = match batman
        .send(UserChangeAction::Arguments(remove_prefix(arg).to_string()))
        .await
    {
        Ok(_) => ApiResponse {
            success: true,
            data: None,
            error: None,
        },
        Err(error) => ApiResponse {
            success: false,
            data: None,
            error: Some(error.to_string()),
        },
    };

    // Serialize the ApiResponse to a JSON string
    let json_string = serde_json::to_string(&resss).unwrap();

    // You can now return the JSON string or send it over a network, etc.
    Ok(json_string)
}

#[tauri::command]
pub async fn set_vol(
    vol: &str,
    state: tauri::State<'_, AsyncProcInputTx>,
) -> Result<String, String> {
    let batman = state.inner.lock().await;
    let resss = match batman
        .send(UserChangeAction::Vol(
            vol.parse::<u16>().expect("error in str to u16"),
        ))
        .await
    {
        Ok(_) => ApiResponse {
            success: true,
            data: None,
            error: None,
        },
        Err(error) => ApiResponse {
            success: false,
            data: None,
            error: Some(error.to_string()),
        },
    };

    // Serialize the ApiResponse to a JSON string
    let json_string = serde_json::to_string(&resss).unwrap();

    // You can now return the JSON string or send it over a network, etc.
    Ok(json_string)
}

#[tauri::command]
pub async fn add_track() -> Result<String, String> {
    let (tx, rx) = std::sync::mpsc::channel();
    let _d = FileDialogBuilder::new().pick_folder(move |f| {
        tx.send(String::from(f.unwrap().to_string_lossy())).unwrap();
    });
    let file_path = rx.recv().unwrap();

    let check = check_path(file_path);
    return Ok(serde_json::to_string(&check).unwrap());
}

fn check_path(file_path: String) -> ApiResponse {
    if is_dir(file_path.clone()).expect("Error in checking dir") {
        let mut has_config_file = false;
        let mut has_wav_music_file = false;
        for file in read_dir(file_path.clone(), false).expect("Error_in_reading dir content") {
            if file.name.clone().unwrap().contains("config.json") {
                has_config_file = true;
            } else if file.name.clone().unwrap().contains(".wav") {
                has_wav_music_file = true;
            }

            if has_wav_music_file && has_config_file {
                return ApiResponse {
                    success: true,
                    data: Some(file_path.to_string()),
                    error: None,
                };
            }
        }

        if !has_config_file {
            return ApiResponse {
                success: false,
                data: None,
                error: Some("Dir Not Have Config.json file".to_string()),
            };
        } else if !has_wav_music_file {
            return ApiResponse {
                success: false,
                data: None,
                error: Some("Only Support .wav Sound".to_string()),
            };
        } else {
            unreachable!();
        };
    } else {
        return ApiResponse {
            success: false,
            data: None,
            error: Some("No Dir Found".to_string()),
        };
    }
}
