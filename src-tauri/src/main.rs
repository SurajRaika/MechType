// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
use serde::{Deserialize, Serialize};
mod key_sound_core;
mod keycode;
mod play_sound;
//mod test;
use tokio::sync::{
    mpsc::{self},
    Mutex,
};

use commands::set_vol;
use commands::{add_track, set_track};

// #[derive(Debug)]
pub struct AsyncProcInputTx {
    inner: Mutex<mpsc::Sender<UserChangeAction>>,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse {
    success: bool,
    data: Option<String>,
    error: Option<String>,
}
#[derive(Debug)]
pub enum UserChangeAction {
    Arguments(String),
    Vol(u16),
}

fn main() {
    let (async_proc_input_tx, async_proc_input_rx) = mpsc::channel(500);
    // let (async_proc_output_tx, mut async_proc_output_rx) = mpsc::channel(1);

    tauri::Builder::default()
        .manage(AsyncProcInputTx {
            inner: Mutex::new(async_proc_input_tx),
        })
        .invoke_handler(tauri::generate_handler![set_track, add_track, set_vol])
        .setup(|app| {
            let resource_path = app
                .path_resolver()
                .resolve_resource("soundPack/super_paper_mario_v1/")
                .expect("failed to resolve resource");
            //  // println!("Resource Path:{:?} \n In String Lossy:{} \n ",resource_path,resource_path.to_string_lossy());
            // let without_prefix = resource_path.strip_prefix("\\\\?\\C:").unwrap_or(&resource_path);

            (tauri::async_runtime::spawn(async move {
                key_sound_core::rustyvibes::start_rustyvibes(
                    async_proc_input_rx,
                    String::from(resource_path.strip_prefix("\\\\?\\C:").unwrap_or(&resource_path).to_string_lossy()),
                )
                .await
            }));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
