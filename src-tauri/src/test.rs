use crate::key_sound_core;
use crate::{ApiResponse, UserChangeAction};
use std::path::PathBuf;
use std::thread;
use std::time::Duration;
// use tauri::api::path::resource_dir;
use tokio::sync::mpsc::{self};

// use tokio::test;

async fn set_vol(
    vol: &str,
    sender: mpsc::Sender<UserChangeAction>,
) -> Result<ApiResponse, ApiResponse> {
    let resss = match sender
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
    Ok(resss)
}

#[tokio::test]
async fn start_key_event_thread() {
    let (async_proc_input_tx, async_proc_input_rx) = mpsc::channel(500);
    (tauri::async_runtime::spawn(async move {
        let relative_path = "./soundPack/super_paper_mario_v1/";

        // Construct a PathBuf from the relative path
        let absolute_path = std::env::current_dir().unwrap().join(relative_path);

        println!("{:?}", absolute_path);
        let path = PathBuf::from(absolute_path.clone());

        // Check if the directory exists
        if path.exists() && path.is_dir() {
            println!("The directory exists.");
        } else {
            assert!(
                path.exists() && path.is_dir(),
                "Directory does not exist at path: {:?}",
                absolute_path
            );
        }

        key_sound_core::rustyvibes::start_rustyvibes(
            async_proc_input_rx,
            String::from(relative_path),
        )
        .await
    }));

    thread::sleep(Duration::from_secs(5));

    for vol_value in ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90"].iter() {
        let response = set_vol(vol_value, async_proc_input_tx.clone())
            .await
            .unwrap();
        if !response.success {
            assert!(
                false,
                "Failed to set volume. Reason: {}",
                response
                    .error
                    .unwrap_or_else(|| String::from("Unknown error"))
            );
        }
        // thread::sleep(Duration::from_secs(5)); // Adjust sleep duration as needed
    }

    // thread::sleep(Duration::from_secs(15));
}
