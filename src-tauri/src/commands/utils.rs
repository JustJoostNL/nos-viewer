use tauri_macros::command;

#[command]
pub fn log(message: String) {
    println!("{}", message);
}
