#[tauri::command]

pub async fn create_window(app: tauri::AppHandle, title: String) {
    println!("create_window command called");

    let _window = tauri::WebviewWindowBuilder::new(
        &app,
        "remote",
        tauri::WebviewUrl::App("index.html".into()),
    )
    .title(title)
    .inner_size(800.0, 600.0)
    .build()
    .expect("error while building window");
}
