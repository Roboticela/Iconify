use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct ImageData {
    size: u32,
    data: String,
}

#[tauri::command]
fn generate_icns(images: Vec<ImageData>) -> Result<String, String> {
    use icns::{IconFamily, IconType, Image as IcnsImage, PixelFormat};
    use image::ImageFormat;

    let mut icon_family = IconFamily::new();

    for img_data in images {
        // Decode base64 PNG data
        let png_bytes = base64::Engine::decode(
            &base64::engine::general_purpose::STANDARD,
            &img_data.data,
        )
        .map_err(|e| format!("Failed to decode base64: {}", e))?;

        // Load PNG image
        let img = image::load_from_memory_with_format(&png_bytes, ImageFormat::Png)
            .map_err(|e| format!("Failed to load PNG image: {}", e))?;

        let rgba_img = img.to_rgba8();

        // Map size to IconType (RGBA32 only - we have RGBA data; 1024 uses RGBA32_512x512_2x)
        let icon_type = match img_data.size {
            16 => IconType::RGBA32_16x16,
            32 => IconType::RGBA32_32x32,
            64 => IconType::RGBA32_64x64,
            128 => IconType::RGBA32_128x128,
            256 => IconType::RGBA32_256x256,
            512 => IconType::RGBA32_512x512,
            1024 => IconType::RGBA32_512x512_2x,
            _ => continue, // Skip unsupported sizes
        };

        // Create Image with RGBA pixel format
        let icns_image = IcnsImage::from_data(
            PixelFormat::RGBA,
            rgba_img.width(),
            rgba_img.height(),
            rgba_img.into_raw(),
        )
        .map_err(|e| format!("Failed to create ICNS image: {}", e))?;

        // Add to icon family with the specified icon type
        icon_family
            .add_icon_with_type(&icns_image, icon_type)
            .map_err(|e| format!("Failed to add icon to family: {}", e))?;
    }

    // Write ICNS to bytes
    let mut icns_data = Vec::new();
    icon_family
        .write(&mut icns_data)
        .map_err(|e| format!("Failed to write ICNS: {}", e))?;

    // Convert to base64
    let base64_icns = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &icns_data);

    Ok(base64_icns)
}

#[tauri::command]
fn write_file(path: String, data: String) -> Result<(), String> {
    use std::io::Write;
    let bytes = base64::Engine::decode(
        &base64::engine::general_purpose::STANDARD,
        &data,
    )
    .map_err(|e| format!("Failed to decode base64: {}", e))?;
    std::fs::File::create(&path)
        .map_err(|e| format!("Failed to create file: {}", e))?
        .write_all(&bytes)
        .map_err(|e| format!("Failed to write file: {}", e))?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![generate_icns, write_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
