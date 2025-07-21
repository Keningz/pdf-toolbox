# PDF Single-Side Scan to Double-Side Tool

A simple web tool that converts single-side scanned documents into double-side documents. All processing is done locally without uploading PDF files to external networks, protecting your privacy and security.

## Features

- 🔒 **Complete Local Processing** - All file processing is done in your browser without uploading to any server
- 📄 **Drag & Drop Support** - Support for click upload and drag files to designated areas
- 🔄 **Smart Page Merging** - Automatically merge front-side documents (forward order) and back-side documents (reverse order) into double-side documents
- ⚠️ **Smart Page Count Handling** - Support for cases where document B has one page less than document A (last page is blank)
- 📱 **Responsive Design** - Support for desktop and mobile devices
- ⚡ **Real-time Progress Display** - Display detailed progress information during processing
- 🎨 **Modern Interface** - Clean and beautiful user interface
- 📝 **Smart File Naming** - Automatically generate output filenames based on document A's filename

## Usage Instructions

### Page Layout

```
|--------------------|--------------------|--------------------|
|                    |                    |                    |
|   Document A Upload |   Document B Upload |   Output Settings   |
|  (Front, Forward)   |  (Back, Reverse)    |   (Filename Setup)  |
|                    |                    |                    |      
|   Upload/Drop Area  |   Upload/Drop Area  |   Process Button    |
|                    |                    |                    |        
|--------------------|--------------------|--------------------|
```

### Operation Steps

1. **Prepare Documents**:
   - Scan front-side documents using a scanner, save as document A.pdf (forward order)
   - Scan back-side documents using a scanner, save as document B.pdf (reverse order)

2. **Upload Files**:
   - Click on document A upload area to select front-side PDF file
   - Click on document B upload area to select back-side PDF file
   - Or drag files directly to the corresponding areas

3. **Set Output**:
   - The program automatically generates output filenames based on document A's filename (e.g., IMG.pdf → IMG_doubleside.pdf)
   - Users can modify the output filename as needed

4. **Start Processing**:
   - Click the "Start Processing" button
   - Wait for processing to complete, the file will be downloaded automatically

### Important Notes

- The page count of the two PDF files must be the same, or document B can have one page less than document A (last page is blank)
- Supported file format: PDF
- Single file size limit: 50MB
- Recommended to use modern browsers (Chrome, Firefox, Safari, Edge)

## Technical Implementation

- **Frontend Framework**: Native HTML5 + CSS3 + JavaScript
- **PDF Processing**: PDF-lib.js library
- **File Download**: download.js library
- **Responsive Design**: CSS Grid + Flexbox

## Local Operation

1. Download all files to a local directory
2. Open the `index.html` file with a modern browser
3. Start using the tool

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Privacy Statement

- All file processing is done locally in your browser
- Your PDF files will not be uploaded to any server
- No personal information will be collected or stored

## License

MIT License - Free to use and modify

---

# PDF文档单面扫描转双面工具

这个简单的Web工具可以将单面扫描的文档转换成双面文档。全程在本地完成，不需要向外部网络上传PDF文件，保护您的隐私安全。

## 功能特点

- 🔒 **完全本地处理** - 所有文件处理都在浏览器中完成，不会上传到任何服务器
- 📄 **支持拖拽上传** - 支持点击上传和拖拽文件到指定区域
- 🔄 **智能页面合并** - 自动将正面文档（正序）和反面文档（倒序）合并为双面文档
- ⚠️ **智能页数处理** - 支持B文档比A文档少1页的情况（最后一页空白页）
- 📱 **响应式设计** - 支持桌面和移动设备使用
- ⚡ **实时进度显示** - 处理过程中显示详细的进度信息
- 🎨 **现代化界面** - 简洁美观的用户界面
- 📝 **智能文件命名** - 自动根据A文档文件名生成输出文件名

## 使用说明

### 页面布局

```
|--------------------|--------------------|--------------------|
|                    |                    |                    |
|   A文档上传区域     |     B文档上传区域   |    输出设置区域     |
|  (正面文档，正序)   |   (反面文档，倒序)  |    (文件名设置)     |
|                    |                    |                    |      
|   上传按钮/拖入区   |    上传按钮/拖入区  |     开始处理按钮    |
|                    |                    |                    |        
|--------------------|--------------------|--------------------|
```

### 操作步骤

1. **准备文档**：
   - 使用扫描仪扫描正面文档，保存为A.pdf文件（正序）
   - 使用扫描仪扫描反面文档，保存为B.pdf文件（倒序）

2. **上传文件**：
   - 点击A文档上传区域，选择正面PDF文件
   - 点击B文档上传区域，选择反面PDF文件
   - 或直接拖拽文件到对应区域

3. **设置输出**：
   - 程序会自动根据A文档的文件名生成输出文件名（例如：IMG.pdf → IMG_doubleside.pdf）
   - 用户可以根据需要修改输出文件名

4. **开始处理**：
   - 点击"开始处理"按钮
   - 等待处理完成，文件将自动下载

### 注意事项

- 两个PDF文件的页面数量必须相同，或者B文档比A文档少1页（最后一页为空白页的情况）
- 支持的文件格式：PDF
- 单个文件大小限制：50MB
- 建议使用现代浏览器（Chrome、Firefox、Safari、Edge）

## 技术实现

- **前端框架**：原生HTML5 + CSS3 + JavaScript
- **PDF处理**：PDF-lib.js库
- **文件下载**：download.js库
- **响应式设计**：CSS Grid + Flexbox

## 本地运行

1. 下载所有文件到本地目录
2. 使用现代浏览器打开 `index.html` 文件
3. 开始使用工具

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 隐私说明

- 所有文件处理都在您的浏览器中本地完成
- 不会向任何服务器上传您的PDF文件
- 不会收集或存储您的个人信息

## 许可证

MIT License - 可自由使用和修改