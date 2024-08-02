#[tauri::command]

pub async fn create_player_window(app: tauri::AppHandle, title: String, item_id: String) {
    println!("create_player_window command called");

    let _window = tauri::WebviewWindowBuilder::new(
        &app,
        "player-".to_string() + &item_id,
        //tauri::WebviewUrl::App("index.html".into()),
        tauri::WebviewUrl::App(("/player/".to_string() + &item_id).into()),
    )
    .title(title)
    .inner_size(800.0, 600.0)
    .build()
    .expect("error while building player window");
}
