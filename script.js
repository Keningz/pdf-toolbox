class PDFDoubleSideTool {
    constructor() {
        this.fileA = null;
        this.fileB = null;
        this.currentLang = 'zh'; // 默认中文
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProcessButton();
        this.setupLanguageSwitch();
    }

    setupEventListeners() {
        // 文件上传区域事件
        this.setupUploadArea('uploadAreaA', 'fileInputA', 'fileStatusA', (file) => {
            this.fileA = file;
            this.updateProcessButton();
        });

        this.setupUploadArea('uploadAreaB', 'fileInputB', 'fileStatusB', (file) => {
            this.fileB = file;
            this.updateProcessButton();
        });

        // 处理按钮事件
        document.getElementById('processBtn').addEventListener('click', () => {
            this.processPDFs();
        });

        // 输出文件名输入事件
        document.getElementById('outputPath').addEventListener('input', () => {
            this.updateProcessButton();
        });
    }

    setupLanguageSwitch() {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        
        // 更新按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // 更新所有文本内容
        document.querySelectorAll('[data-zh][data-en]').forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
        });

        // 更新placeholder
        document.querySelectorAll('[data-zh-placeholder][data-en-placeholder]').forEach(element => {
            element.placeholder = element.getAttribute(`data-${lang}-placeholder`);
        });

        // 更新进度文本
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = progressText.getAttribute(`data-${lang}`);
        }
    }

    setupUploadArea(areaId, inputId, statusId, callback) {
        const area = document.getElementById(areaId);
        const input = document.getElementById(inputId);
        const status = document.getElementById(statusId);

        // 点击上传
        area.addEventListener('click', () => {
            input.click();
        });

        // 文件选择
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelect(file, status, callback);
            }
        });

        // 拖拽事件
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });

        area.addEventListener('dragleave', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
        });

        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileSelect(file, status, callback);
                input.files = e.dataTransfer.files;
            }
        });
    }

    handleFileSelect(file, statusElement, callback) {
        if (file.type !== 'application/pdf') {
            const errorMsg = this.currentLang === 'zh' ? '错误：请选择PDF文件' : 'Error: Please select a PDF file';
            this.showFileStatus(statusElement, errorMsg, 'error');
            return;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB限制
            const errorMsg = this.currentLang === 'zh' ? '错误：文件大小不能超过50MB' : 'Error: File size cannot exceed 50MB';
            this.showFileStatus(statusElement, errorMsg, 'error');
            return;
        }

        const successMsg = this.currentLang === 'zh' ? `已选择：${file.name} (${this.formatFileSize(file.size)})` : `Selected: ${file.name} (${this.formatFileSize(file.size)})`;
        this.showFileStatus(statusElement, successMsg, 'success');
        
        // 如果是A文档，自动生成输出文件名
        if (statusElement.id === 'fileStatusA') {
            this.updateOutputFilename(file.name);
        }
        
        callback(file);
    }

    showFileStatus(element, message, type) {
        element.textContent = message;
        element.className = `file-status ${type}`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateOutputFilename(originalFilename) {
        // 移除.pdf扩展名
        const nameWithoutExt = originalFilename.replace(/\.pdf$/i, '');
        // 生成新的文件名
        const newFilename = `${nameWithoutExt}_doubleside.pdf`;
        
        // 更新输出文件名输入框
        const outputPathInput = document.getElementById('outputPath');
        outputPathInput.value = newFilename;
        
        // 触发input事件以更新处理按钮状态
        outputPathInput.dispatchEvent(new Event('input'));
    }

    updateProcessButton() {
        const processBtn = document.getElementById('processBtn');
        const outputPath = document.getElementById('outputPath').value.trim();
        
        const canProcess = this.fileA && this.fileB && outputPath;
        processBtn.disabled = !canProcess;
    }

    async processPDFs() {
        if (!this.fileA || !this.fileB) {
            const errorMsg = this.currentLang === 'zh' ? '请先选择两个PDF文件' : 'Please select two PDF files first';
            this.showProcessingStatus(errorMsg, 'error');
            return;
        }

        const outputPath = document.getElementById('outputPath').value.trim();
        if (!outputPath) {
            const errorMsg = this.currentLang === 'zh' ? '请输入输出文件名' : 'Please enter output filename';
            this.showProcessingStatus(errorMsg, 'error');
            return;
        }

        this.setProcessingState(true);
        this.showProgress();

        try {
            await this.mergePDFs();
        } catch (error) {
            console.error('处理PDF时出错:', error);
            const errorMsg = this.currentLang === 'zh' ? `处理失败：${error.message}` : `Processing failed: ${error.message}`;
            this.showProcessingStatus(errorMsg, 'error');
        } finally {
            this.setProcessingState(false);
        }
    }

    async mergePDFs() {
        this.updateProgress(10, this.currentLang === 'zh' ? '正在加载PDF文件...' : 'Loading PDF files...');

        // 加载PDF文件
        const pdfBytesA = await this.fileToArrayBuffer(this.fileA);
        const pdfBytesB = await this.fileToArrayBuffer(this.fileB);

        this.updateProgress(30, this.currentLang === 'zh' ? '正在解析PDF文档...' : 'Parsing PDF documents...');

        // 创建PDF文档
        const pdfDoc = await PDFLib.PDFDocument.create();
        
        // 加载两个PDF
        const pdfA = await PDFLib.PDFDocument.load(pdfBytesA);
        const pdfB = await PDFLib.PDFDocument.load(pdfBytesB);

        this.updateProgress(50, this.currentLang === 'zh' ? '正在合并页面...' : 'Merging pages...');

        // 获取页面数量
        const pagesA = pdfA.getPages();
        const pagesB = pdfB.getPages();

        // 检查页面数量是否匹配或B文档少1页（最后一页空白的情况）
        if (pagesA.length !== pagesB.length && pagesA.length !== pagesB.length + 1) {
            const errorMsg = this.currentLang === 'zh' 
                ? `页面数量不匹配：A文档${pagesA.length}页，B文档${pagesB.length}页。B文档页数应该等于A文档页数，或者比A文档少1页（最后一页为空白页的情况）`
                : `Page count mismatch: Document A has ${pagesA.length} pages, Document B has ${pagesB.length} pages. Document B should have the same number of pages as Document A, or one page less (last page is blank)`;
            throw new Error(errorMsg);
        }

        // 检查是否为B文档少1页的情况
        const isBShortOnePage = pagesA.length === pagesB.length + 1;
        if (isBShortOnePage) {
            const warningMsg = this.currentLang === 'zh'
                ? `检测到B文档比A文档少1页，可能是最后一页为空白页。程序将正常处理，但建议检查扫描完整性。`
                : `Detected that Document B has one page less than Document A, possibly because the last page is blank. The program will process normally, but it's recommended to check scan completeness.`;
            this.showProcessingStatus(warningMsg, 'warning');
        }

        // 复制A文档的页面（正序）
        for (let i = 0; i < pagesA.length; i++) {
            const [pageA] = await pdfDoc.copyPages(pdfA, [i]);
            pdfDoc.addPage(pageA);
        }

        // 复制B文档的页面（倒序）
        for (let i = pagesB.length - 1; i >= 0; i--) {
            const [pageB] = await pdfDoc.copyPages(pdfB, [i]);
            pdfDoc.addPage(pageB);
        }

        this.updateProgress(80, this.currentLang === 'zh' ? '正在生成最终文档...' : 'Generating final document...');

        // 保存PDF
        const mergedPdfBytes = await pdfDoc.save();

        this.updateProgress(100, this.currentLang === 'zh' ? '处理完成！' : 'Processing complete!');

        // 下载文件
        const outputPath = document.getElementById('outputPath').value.trim();
        const filename = outputPath.endsWith('.pdf') ? outputPath : `${outputPath}.pdf`;
        
        download(mergedPdfBytes, filename, 'application/pdf');

        const successMsg = this.currentLang === 'zh' ? '文档处理成功！文件已开始下载。' : 'Document processed successfully! File download started.';
        this.showProcessingStatus(successMsg, 'success');
        
        // 隐藏进度条
        setTimeout(() => {
            this.hideProgress();
        }, 2000);
    }

    fileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    setProcessingState(processing) {
        const processBtn = document.getElementById('processBtn');
        if (processing) {
            processBtn.classList.add('processing');
            processBtn.disabled = true;
        } else {
            processBtn.classList.remove('processing');
            processBtn.disabled = false;
        }
    }

    showProgress() {
        document.getElementById('progressContainer').hidden = false;
    }

    hideProgress() {
        document.getElementById('progressContainer').hidden = true;
    }

    updateProgress(percentage, text) {
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = text;
    }

    showProcessingStatus(message, type) {
        const statusElement = document.getElementById('processingStatus');
        statusElement.textContent = message;
        statusElement.className = `processing-status ${type}`;
        
        // 如果是warning类型，3秒后自动清除
        if (type === 'warning') {
            setTimeout(() => {
                if (statusElement.className.includes('warning')) {
                    statusElement.textContent = '';
                    statusElement.className = 'processing-status';
                }
            }, 5000);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new PDFDoubleSideTool();
});

// 防止页面刷新时丢失文件
window.addEventListener('beforeunload', (e) => {
    // 如果有正在处理的文件，提示用户
    const processBtn = document.getElementById('processBtn');
    if (processBtn.classList.contains('processing')) {
        e.preventDefault();
        e.returnValue = '正在处理PDF文件，确定要离开吗？';
    }
}); 