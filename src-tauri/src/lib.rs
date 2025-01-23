use tauri::Error as TauriError;
use std::fs::File;
use std::io::{Read, Write};
use tauri_plugin_sql::{Builder, Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]

#[tauri::command]
fn read_file(name: String) -> Result<String, TauriError> {
    let file = File::open(name);
    let mut file = match file {
        Ok(f) => f,
        Err(err) => return Err(TauriError::Io(err)),
    };
    let mut content = String::new();
    if let Err(err) = file.read_to_string(&mut content) {
        return Err(TauriError::Io(err));
    }
    Ok(content)
}

#[tauri::command]
fn write_file(name: String, content: String) -> Result<(), TauriError> {
    match File::create(name) {
        Err(err) => Err(TauriError::Io(err)),
        Ok(mut buffer) => match buffer.write(content.as_bytes()) {
            Ok(_) => Ok(()),
            Err(err) => Err(TauriError::Io(err)),
        },
    }
}

pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE cluster_server (id INTEGER PRIMARY KEY, name TEXT, cluster_id TEXT, server TEXT, user TEXT, password TEXT, port TEXT);",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:k3s.db", migrations).build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![read_file, write_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


