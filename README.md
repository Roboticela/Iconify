<div align="center">

![App Logo](public/Favicon.svg)

# Roboticela Iconify

[![AGPL License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-Latest-orange.svg)](https://www.rust-lang.org/)

**A comprehensive icon generation and management tool for creating platform-specific icons**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage-guide) • [Contributing](#-contributing) • [Support](#-support)

---

</div>

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Building for Production](#-building-for-production)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [Code of Conduct](#-code-of-conduct)
- [Support](#-support)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [About Roboticela](#-about-roboticela)

---

## 🌟 About

**Roboticela Iconify** is a modern, cross-platform desktop application designed to simplify the process of creating and managing icons for various platforms and frameworks. Built with Tauri, React, and TypeScript, it provides developers and designers with powerful tools to generate platform-specific icons from a single source image.

Whether you're building iOS apps, Android applications, web PWAs, desktop applications, or cross-platform frameworks, Iconify helps you create all the required icon sizes and formats with customizable styling options.

### Why This Project?

- ✅ **Free and Open Source** - Licensed under AGPL-3.0
- ✅ **Cross-Platform** - Works on Linux, Windows, and macOS
- ✅ **Fast & Lightweight** - Built with Tauri and Rust for maximum performance
- ✅ **Multi-Platform Support** - Generate icons for iOS, Android, Web, Desktop, and more
- ✅ **Customizable** - Control background color, scale, position, and border roundness
- ✅ **Real-Time Preview** - See your icons on device mockups before generating
- ✅ **Batch Generation** - Generate all required icon sizes at once
- ✅ **Modern UI** - Beautiful, responsive design with dark mode support
- ✅ **Actively Maintained** - Regular updates and community support

---

## ✨ Features

### 🎨 Icon Customization
- **Background Color** - Choose any color for your icon background
- **Scale Control** - Adjust icon size from 0% to 500%
- **Position Control** - Fine-tune icon position with X and Y coordinates
- **Border Roundness** - Customize corner radius for rounded icons
- **Real-Time Preview** - See changes instantly as you adjust settings

### 📱 Platform Support

#### iOS & Apple Platforms
- **iOS** - iPhone and iPad app icons (all required sizes)
- **watchOS** - Apple Watch app icons
- **Apple TV** - tvOS app icons
- **macOS** - Mac application icons
- **ICNS Format** - Native macOS icon format support

#### Android Platforms
- **Android** - Standard Android app icons (all densities)
- **Android TV** - TV-optimized icons
- **Wear OS** - Smartwatch icons

#### Web Platforms
- **PWA** - Progressive Web App icons
- **Browser Extensions** - Extension icons for Chrome, Firefox, Edge
- **React** - React app favicons and icons
- **Vue** - Vue.js app icons
- **Angular** - Angular app icons
- **Next.js** - Next.js optimized icons

#### Desktop Frameworks
- **Electron** - Electron application icons
- **Tauri** - Tauri application icons (with proper folder structure)
- **Native Desktop** - Windows native application icons
- **Qt** - Qt framework icons
- **Java (JavaFX/Swing)** - Java desktop application icons
- **Flutter Desktop** - Flutter desktop app icons

### 📦 Export Features
- **ZIP Download** - Download all icons for a platform as a single ZIP file
- **Organized Structure** - Icons organized by platform and size
- **Multiple Formats** - PNG, ICO, and ICNS format support
- **Progress Tracking** - Real-time progress indicator during generation

### 🎯 Additional Features
- **Image Upload** - Drag and drop or select image files
- **Device Mockups** - Preview icons on realistic device frames
- **Theme Support** - Light and dark mode
- **Responsive Design** - Works on various screen sizes
- **Smooth Animations** - Powered by Framer Motion

---

## 🛠️ Technology Stack

### Frontend
- **[React 19](https://reactjs.org/)** - Modern UI library with latest features
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animation library
- **[React Colorful](https://github.com/omgovich/react-colorful)** - Color picker component
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[JSZip](https://stuk.github.io/jszip/)** - ZIP file generation
- **[Vite 7](https://vitejs.dev/)** - Lightning-fast build tool

### Backend
- **[Tauri 2](https://tauri.app/)** - Desktop application framework
- **[Rust](https://www.rust-lang.org/)** - Systems programming language
- **[@fiahfy/icns](https://github.com/fiahfy/icns)** - ICNS format generation

### Development Tools
- **[npm](https://www.npmjs.com/)** - Node package manager
- **[ESLint](https://eslint.org/)** - Code linting
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TypeScript-specific linting

---

## 📋 Prerequisites

Before installing, ensure you have the following:

> 💡 **For detailed installation instructions and complete dependency lists, see [INSTALL_DEPENDENCIES.md](INSTALL_DEPENDENCIES.md)**

### Required Software

1. **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
2. **Rust** (latest stable) - [Install](https://www.rust-lang.org/tools/install)
3. **npm** - Node package manager

### System Dependencies

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### Linux (Fedora)
```bash
sudo dnf check-update
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### Linux (Arch)
```bash
sudo pacman -Syu
sudo pacman -S webkit2gtk \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  gtk3 \
  libappindicator-gtk3 \
  librsvg
```

#### macOS
```bash
xcode-select --install
```

#### Windows
- Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 10/11)

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Roboticela/iconify.git
cd iconify
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

### 3. Build Rust Dependencies

```bash
cd src-tauri
cargo build
cd ..
```

---

## 🚀 Running the Application

### Development Mode

Run the application in development mode with hot-reload:

```bash
npm run tauri dev
```

This will:
- Start the Vite development server for the frontend
- Build and run the Tauri application
- Enable hot-reload for both frontend and backend changes

### Frontend Only (Web Preview)

To test the frontend without Tauri:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## 📦 Building for Production

### Prerequisites

Before building for production, ensure you have:

1. **All dependencies installed** - See [INSTALL_DEPENDENCIES.md](INSTALL_DEPENDENCIES.md) for detailed platform-specific setup
2. **Node.js 20+** and **npm** installed
3. **Rust** and **Cargo** installed
4. **Platform-specific build tools** (WebKit2GTK for Linux, MSVC for Windows, Xcode for macOS)

To verify your setup:
```bash
node --version
npm --version
rustc --version
cargo --version
```

### Quick Build (Current Platform)

Build for your current platform:

```bash
npm run build
npm run tauri build
```

This will:
1. Build the frontend (React + Vite)
2. Compile the Rust backend
3. Bundle the application with Tauri
4. Generate platform-specific installers

### Build Output Locations

**Desktop builds:**
```
src-tauri/target/release/          # Executables
src-tauri/target/release/bundle/   # Installers
```

### Advanced Build Options

#### Debug Build (Faster, Larger, with Debug Symbols)
```bash
npm run tauri build -- --debug
```

#### Release Build with Optimizations (Default)
```bash
npm run tauri build
```

#### Verbose Build Output
```bash
npm run tauri build -- --verbose
```

### 🔐 Code Signing and Checksums

All builds automatically generate SHA256 checksums for integrity verification:

```bash
# Build with automatic checksum generation
npm run tauri build    # Desktop (Windows, macOS, Linux)
```

Each build artifact gets:
- Individual `.sha256` checksum file
- Combined `CHECKSUMS.txt` manifest

**Manually generate checksums:**
```bash
npm run checksums
```

**Verify downloads:**
```bash
# Linux/macOS
sha256sum -c iconify.dmg.sha256

# Windows (PowerShell)
Get-FileHash iconify.exe -Algorithm SHA256
```

For detailed code signing, notarization, and security information, see [SIGNING.md](SIGNING.md).

### Build Troubleshooting

**Frontend build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

**Rust compilation errors:**
```bash
# Update Rust toolchain
rustup update

# Clean Rust build cache
cd src-tauri
cargo clean
cd ..
```

**Missing dependencies:**
- See [INSTALL_DEPENDENCIES.md](INSTALL_DEPENDENCIES.md) for complete dependency lists

### Production Build Checklist

Before releasing:

- [ ] Update version in `package.json` and `src-tauri/tauri.conf.json`
- [ ] Update `CHANGELOG.md` with release notes (if exists)
- [ ] Test the application thoroughly in development mode
- [ ] Run `npm run tauri build` for all platforms
- [ ] Verify checksums are generated
- [ ] Test installers on target platforms
- [ ] Run security audits: `npm audit` and `cargo audit`
- [ ] Update documentation if needed

---

## 📚 Usage Guide

### Getting Started

1. **Launch the Application** - Open the built application or run in dev mode
2. **Select an Image** - Click the image selector area to upload your source image
3. **Choose a Platform** - Select the target platform from the header dropdown
4. **Customize Your Icon** - Adjust background color, scale, position, and border roundness
5. **Preview** - View your icon on device mockups in real-time
6. **Download** - Generate and download all required icon sizes as a ZIP file

### Customizing Icons

#### Background Color
- Click the color picker to choose a background color
- Use the hex input for precise color values
- The background appears behind your icon image

#### Scale
- Adjust the scale slider (0% to 500%) to resize your icon
- 100% means the icon fills the available space
- Values below 100% create padding around the icon
- Values above 100% can crop the icon (use with position controls)

#### Position
- **Position X** - Move icon horizontally (0% = left, 100% = right)
- **Position Y** - Move icon vertically (0% = top, 100% = bottom)
- Useful for fine-tuning icon placement, especially with scaled icons

#### Border Roundness
- Adjust corner radius in pixels
- 0px = square corners
- Higher values = more rounded corners
- Platform-specific recommendations:
  - iOS: 0px (iOS handles rounding automatically)
  - Android: 0px (Android handles rounding automatically)
  - Web: Varies by platform requirements

### Platform-Specific Notes

#### iOS
- Generates all required sizes for iPhone and iPad
- Includes ICNS format for macOS compatibility
- Icons are automatically rounded by iOS, but you can preview with custom roundness

#### Android
- Generates icons for all density buckets (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- Android automatically applies adaptive icon masks
- Square icons recommended (Android handles the shape)

#### Web (PWA)
- Generates favicon and PWA icon sizes
- Includes multiple formats for browser compatibility
- Follows PWA best practices for icon sizes

#### Tauri
- Generates icons in the proper `src-tauri/icons/` folder structure
- Includes all required sizes for Windows, macOS, and Linux
- Ready to use in your Tauri project

### Downloading Icons

1. **Select Platform** - Choose your target platform from the header
2. **Customize** - Adjust all settings to your preference
3. **Click Download** - The download button generates all icons
4. **Wait for Generation** - Progress bar shows generation status
5. **Extract ZIP** - Unzip the downloaded file to access all icon sizes

The ZIP file contains:
- All required icon sizes for the selected platform
- Proper folder structure (for platforms like Tauri)
- Icons named according to platform conventions

---

## 📁 Project Structure

```
iconify/
│
├── src/                          # React frontend source
│   ├── components/               # React components
│   │   ├── AppHeader.tsx        # Header with platform selector
│   │   ├── ImageSelector.tsx    # Image upload component
│   │   ├── InfoAndColorSelector.tsx  # Settings panel
│   │   ├── PreviewContainer.tsx # Preview area
│   │   ├── Devices.tsx          # Device mockup components
│   │   ├── ThemeColorPicker.tsx # Color picker
│   │   └── ui/                  # UI components (buttons, dropdowns)
│   │
│   ├── contexts/                 # React contexts
│   │   ├── ImageSettingsContext.tsx  # Icon generation settings
│   │   ├── PlatformContext.tsx  # Platform selection state
│   │   └── ThemeContext.tsx     # Theme state management
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── iconGenerator.ts     # Icon generation logic
│   │   ├── downloadHandler.ts   # ZIP download handling
│   │   └── utils.ts             # Helper functions
│   │
│   ├── assets/                   # Static assets
│   │   └── CompanyLogo.png      # Roboticela logo
│   │
│   ├── App.tsx                   # Main app component
│   ├── App.css                   # App styles
│   └── main.tsx                  # React entry point
│
├── src-tauri/                    # Tauri/Rust backend
│   ├── src/
│   │   ├── main.rs              # Tauri entry point
│   │   └── lib.rs               # Tauri commands (if any)
│   │
│   ├── icons/                    # Application icons
│   ├── capabilities/             # Tauri security capabilities
│   ├── Cargo.toml               # Rust dependencies
│   ├── build.rs                 # Build script
│   └── tauri.conf.json          # Tauri configuration
│
├── public/                       # Public static assets
│   └── Favicon.svg              # Favicon
│
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML entry point
├── package.json                 # Node.js package config
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite configuration
├── LICENSE                      # AGPL-3.0 license
└── README.md                    # This file
```

---

## ⚙️ Configuration

### Tauri Configuration

The `src-tauri/tauri.conf.json` file contains Tauri-specific settings:

- App identifier and version
- Window size and title
- Security capabilities
- Bundle configuration
- Platform-specific options

Modify this file to customize the application behavior.

### Environment Variables

Currently, no environment variables are required. All configuration is handled through the UI.

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or spreading the word, every contribution matters.

### Ways to Contribute

1. **Report Bugs** - Open an issue on GitHub with detailed information
2. **Suggest Features** - Share your ideas for new features or improvements
3. **Write Code** - Submit pull requests with bug fixes or new features
4. **Improve Documentation** - Help make the docs clearer and more comprehensive
5. **Share the Project** - Star the repository and tell others about it

### Getting Started with Development

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/iconify.git
   cd iconify
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

   Commit message prefixes:
   - `Add:` - New feature
   - `Fix:` - Bug fix
   - `Update:` - Improvement to existing feature
   - `Docs:` - Documentation changes
   - `Style:` - Code style changes (formatting, etc.)
   - `Refactor:` - Code refactoring
   - `Test:` - Adding or updating tests
   - `Chore:` - Maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Provide a clear description of your changes
   - Reference any related issues

### Code Style Guidelines

#### Frontend (TypeScript/React)
- Use functional components with hooks
- Use TypeScript for type safety
- Follow React best practices
- Use TailwindCSS utility classes for styling
- Keep components small and focused
- Write descriptive variable and function names

#### Backend (Rust)
- Follow Rust conventions and idioms
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Handle errors properly
- Write documentation comments for public APIs

### Testing

Before submitting a pull request:

1. Test your changes in development mode
2. Build the application and test the production build
3. Test on multiple platforms if possible
4. Verify no existing functionality is broken
5. Check for console errors or warnings

### Pull Request Review Process

1. A maintainer will review your PR
2. They may request changes or ask questions
3. Make any requested updates
4. Once approved, your PR will be merged
5. Your contribution will be credited

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive Behavior:**
- Being respectful and inclusive
- Being patient and welcoming to newcomers
- Accepting constructive criticism gracefully
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable Behavior:**
- Harassment, trolling, or derogatory comments
- Personal or political attacks
- Publishing others' private information
- Any conduct inappropriate in a professional setting

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly. Maintainers have the right to remove, edit, or reject comments, commits, code, issues, and other contributions that don't align with this Code of Conduct.

---

## 💬 Support

Need help? We're here for you!

### GitHub Issues

For bug reports, feature requests, or technical issues:

🐛 **[Open an Issue](https://github.com/Roboticela/iconify/issues)**

When reporting a bug, please include:
- Operating system and version
- Application version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Error messages or logs

### Community

- 🐙 **GitHub**: [Roboticela/iconify](https://github.com/Roboticela/iconify)
- ⭐ **Star the Project**: Show your support by starring the repository!

### FAQ

**Q: Is this application free to use?**  
A: Yes! It's completely free and open-source under the AGPL-3.0 license.

**Q: Can I use this for commercial purposes?**  
A: Yes, but you must comply with the AGPL-3.0 license terms. Any modifications made to the software that is used over a network must be made available to users.

**Q: What image formats are supported?**  
A: The application supports common image formats including PNG, JPEG, SVG, and WebP.

**Q: Can I customize the generated icons?**  
A: Yes! You can adjust background color, scale, position, and border roundness through the UI.

**Q: What if I find a security vulnerability?**  
A: Please report security issues responsibly by opening a GitHub issue or contacting the maintainers directly.

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Batch Processing** - Generate icons for multiple platforms at once
- [ ] **Icon Templates** - Pre-configured templates for common use cases
- [ ] **Export Formats** - Additional format support (SVG, WebP)
- [ ] **Icon Library** - Built-in library of common icons
- [ ] **History** - Save and recall previous icon configurations
- [ ] **Presets** - Save and share custom icon presets
- [ ] **CLI Tool** - Command-line interface for automation
- [ ] **Plugin System** - Extensible platform support
- [ ] **Cloud Sync** - Optional cloud backup of configurations
- [ ] **Multi-language Support** - Internationalization (i18n)

### Version History

**v0.1.0** (Current)
- Initial release
- Multi-platform icon generation
- Customizable icon settings
- Real-time preview
- ZIP download functionality
- Dark mode support

See [Releases](https://github.com/Roboticela/iconify/releases) for detailed changelog.

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### What This Means

✅ **You CAN:**
- Use the software for any purpose
- Study how the software works and modify it
- Distribute copies of the software
- Distribute modified versions of the software
- Use the software commercially

⚠️ **You MUST:**
- Disclose your source code when distributing
- Include the original license and copyright notice
- State any changes made to the original code
- Make your modified source code available under AGPL-3.0
- **If you run a modified version on a server/network, provide source access to users**

❌ **You CANNOT:**
- Hold the authors liable for damages
- Use the authors' names for promotion without permission

The AGPL-3.0 license is similar to GPL-3.0 but adds an important provision: if you modify this software and make it available over a network (e.g., as a web service), you must also make the complete source code available to users of that service.

**Full License Text:** See the [LICENSE](LICENSE) file for complete terms and conditions.

### Why AGPL?

We chose the AGPL license to ensure that improvements to this software remain open and available to the community, even when the software is used as a service. This protects the rights of end users and promotes collaboration.

---

## 🙏 Acknowledgments

This project wouldn't be possible without these amazing open-source projects and communities:

### Core Technologies
- **[Tauri](https://tauri.app/)** - For the incredible desktop application framework
- **[React](https://reactjs.org/)** - For the powerful UI library
- **[Rust](https://www.rust-lang.org/)** - For performance and safety
- **[Vite](https://vitejs.dev/)** - For lightning-fast development experience

### Libraries & Tools
- **[TailwindCSS](https://tailwindcss.com/)** - For beautiful, utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - For smooth animations
- **[React Colorful](https://github.com/omgovich/react-colorful)** - For color picking
- **[JSZip](https://stuk.github.io/jszip/)** - For ZIP file generation
- **[@fiahfy/icns](https://github.com/fiahfy/icns)** - For ICNS format support
- **[Lucide React](https://lucide.dev/)** - For comprehensive icon sets
- **[TypeScript](https://www.typescriptlang.org/)** - For type safety

### Community
- All the contributors who have helped improve this project
- The open-source community for inspiration and support
- Users who provide feedback and report issues

### Special Thanks
- **Free Software Foundation** - For promoting software freedom
- **GitHub** - For hosting and collaboration tools
- All the developers who contribute to open-source

---

## 🏢 About Roboticela

<div align="center">

<img src="src/assets/CompanyLogo.png" alt="Logo" width="200" style="padding:30px;" />

**[Roboticela](https://github.com/Roboticela)** is dedicated to creating high-quality, open-source software solutions that empower developers and designers.

</div>

### Our Mission

To build innovative, accessible, and privacy-focused software that respects user freedom and promotes open collaboration.

### Our Projects

This **Iconify** tool is proudly developed and maintained by Roboticela. We believe in:

- 🔓 **Open Source** - Transparency and community collaboration
- 🔒 **Privacy** - Your data belongs to you
- 🚀 **Innovation** - Modern technologies and best practices
- 🌍 **Accessibility** - Software for everyone, everywhere
- 💚 **Sustainability** - Building for the long term

### Get in Touch

- 🐙 **GitHub**: [github.com/Roboticela](https://github.com/Roboticela)
- 📧 **Email**: contact@roboticela.com
- 🔗 **Project Repository**: [github.com/Roboticela/iconify](https://github.com/Roboticela/iconify)

### More Projects

Check out our other open-source projects on our [GitHub profile](https://github.com/Roboticela). We're always working on new ideas and welcome collaboration!

### Support Roboticela

If you find our projects useful:

- ⭐ **Star our repositories** on GitHub
- 🐛 **Report bugs** and **suggest features**
- 🤝 **Contribute code** or **improve documentation**
- 📣 **Spread the word** and share with others

---

<div align="center">

## 💖 Thank You!

Thank you for using **Roboticela Iconify**. We hope it helps streamline your icon generation workflow and contributes to your project's success.

**Built with ❤️ by [Roboticela](https://github.com/Roboticela)**

© 2025 Roboticela. Licensed under AGPL-3.0.

---

⭐ **If you find this project useful, please consider giving it a star on GitHub!** ⭐

[⬆ Back to Top](#-roboticela-iconify)

</div>
