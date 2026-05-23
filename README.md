# Student ID Generator

A comprehensive web application for generating professional student documents including ID cards, certificates, schedules, admission letters, and transcripts. Built with Next.js and React, featuring a modern UI and customizable design options.

## 🎯 Features

### 1. **Student ID Card Generator**
- Portrait and landscape card layouts
- Customizable design elements (colors, fonts, borders)
- Photo upload support
- Export to high-quality images

### 2. **Certificate of Enrollment**
- Professional certificate design
- Watermark support (line and text watermarks)
- Customizable patterns and borders
- Multiple export quality options
- Complete student and academic information

### 3. **Course Schedule Generator**
- Weekly and compact view modes
- Multiple course management
- Time format customization (12h/24h)
- Course color coding
- Display options (weekends, instructors, locations, etc.)

### 4. **Admission Letter Generator**
- Formal letter templates
- Customizable content sections
- Signature support
- Watermark and border options
- Professional formatting

### 5. **Transcript Generator**
- Academic transcript creation
- Course and grade management
- GPA calculation
- Multiple semester support
- Export functionality

## 🚀 Technology Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Management**: React Hook Form
- **Export**: html2canvas
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd student-card
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
pnpm build
pnpm start
```

## 部署指南：

### Vercel 部署:

直接将代码推送到 GitHub，然后在 Vercel 中导入项目。
框架预设保持为 Next.js 即可，Vercel 会自动识别并部署。

### Cloudflare Pages 部署:

将代码推送到 GitHub，在 Cloudflare 面板选择 "Pages" -> "Connect to Git"。
构建设置：
Framework preset: 选择 None（不要选 Next.js，因为这是包含后端的全栈部署）。
Build command: 填写 npm run pages:build
Build output directory: 填写 .vercel/output/static

如果构建失败，可以检查一下 Cloudflare 面板上的 Node.js 版本是否设置为较高版本，比如 NODE_VERSION=20。

## 📖 Usage

1. **Select Document Type**: Choose from ID Card, Certificate, Schedule, Admission Letter, or Transcript
2. **Fill Information**: Enter student and institutional details
3. **Customize Design**: Adjust colors, fonts, watermarks, and other design elements
4. **Preview**: Review your document in real-time
5. **Export**: Download as high-quality PNG image

## 🎨 Customization Options

- **Colors**: Header, text, background, accent colors
- **Fonts**: Multiple font family options
- **Watermarks**: Text and line watermarks with customizable opacity and angle
- **Borders**: Various border styles and colors
- **Patterns**: Decorative patterns for certificates
- **Export Quality**: Low, Medium, High, and Ultra quality options

## 🙏 Thanks

- [BotolMehedi](https://github.com/BotolMehedi/student-id-card-generator)
- [Selenium39](https://github.com/Selenium39/student-id-generator)
 