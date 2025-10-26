// 全局变量
let currentStep = 1;
let uploadedFiles = {
    characters: [],
    scenes: [],
    dialogues: []
};
let generatedManga = null;
let exportHistory = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 初始化步骤
    initializeSteps();
    
    // 初始化文件上传
    initializeFileUpload();
    
    // 初始化预览
    initializePreview();
    
    // 初始化导出
    initializeExport();
    
    // 初始化右侧面板
    initializeRightPanel();
    
    // 初始化浮动操作按钮
    initializeFAB();
    
    // 初始化示例数据
    loadSampleData();
}

// 初始化步骤
function initializeSteps() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.dataset.step);
            switchToStep(stepNumber);
        });
    });
    
    // 默认显示第一步
    switchToStep(1);
}

// 切换到指定步骤
function switchToStep(stepNumber) {
    // 更新当前步骤
    currentStep = stepNumber;
    
    // 更新步骤状态
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // 更新内容区域
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (parseInt(section.dataset.section) === stepNumber) {
            section.classList.add('active');
        }
    });
}

// 初始化文件上传
function initializeFileUpload() {
    // 角色上传
    const characterUpload = document.getElementById('character-upload');
    if (characterUpload) {
        characterUpload.addEventListener('change', function(e) {
            handleFileUpload(e, 'characters');
        });
    }
    
    // 场景上传
    const sceneUpload = document.getElementById('scene-upload');
    if (sceneUpload) {
        sceneUpload.addEventListener('change', function(e) {
            handleFileUpload(e, 'scenes');
        });
    }
    
    // 对话上传
    const dialogueUpload = document.getElementById('dialogue-upload');
    if (dialogueUpload) {
        dialogueUpload.addEventListener('change', function(e) {
            handleFileUpload(e, 'dialogues');
        });
    }
}

// 处理文件上传
function handleFileUpload(event, type) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    // 添加到对应类型的文件列表
    uploadedFiles[type] = [...uploadedFiles[type], ...files];
    
    // 更新文件列表显示
    updateFileList(type);
    
    // 显示通知
    showNotification(`成功上传 ${files.length} 个${getTypeName(type)}文件`, 'success');
}

// 更新文件列表显示
function updateFileList(type) {
    const fileList = document.getElementById(`${type}-list`);
    if (!fileList) return;
    
    // 清空现有列表
    fileList.innerHTML = '';
    
    // 添加文件项
    uploadedFiles[type].forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-file-image';
        
        const fileName = document.createElement('span');
        fileName.textContent = file.name;
        
        fileInfo.appendChild(icon);
        fileInfo.appendChild(fileName);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-icon';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', function() {
            removeFile(type, index);
        });
        
        fileItem.appendChild(fileInfo);
        fileItem.appendChild(removeBtn);
        
        fileList.appendChild(fileItem);
    });
}

// 移除文件
function removeFile(type, index) {
    uploadedFiles[type].splice(index, 1);
    updateFileList(type);
    showNotification('文件已移除', 'info');
}

// 获取类型名称
function getTypeName(type) {
    const typeNames = {
        characters: '角色',
        scenes: '场景',
        dialogues: '对话'
    };
    return typeNames[type] || '';
}

// 初始化预览
function initializePreview() {
    // 生成预览按钮
    const generateBtn = document.getElementById('generate-preview');
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePreview);
    }
    
    // 缩放控制
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => zoomPreview(1.2));
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => zoomPreview(0.8));
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => zoomPreview(1, true));
    }
}

// 生成预览
function generatePreview() {
    // 检查是否有足够的文件
    if (uploadedFiles.characters.length === 0 || 
        uploadedFiles.scenes.length === 0 || 
        uploadedFiles.dialogues.length === 0) {
        showNotification('请先上传角色、场景和对话文件', 'warning');
        return;
    }
    
    // 显示加载状态
    showNotification('正在生成预览，请稍候...', 'info');
    
    // 模拟生成过程
    setTimeout(() => {
        // 生成示例预览
        const previewContent = document.getElementById('preview-content');
        if (previewContent) {
            previewContent.innerHTML = `
                <div class="preview-manga">
                    <img src="https://picsum.photos/seed/manga-preview/600/400.jpg" alt="漫画预览">
                </div>
            `;
        }
        
        // 更新缩放级别显示
        updateZoomLevel(100);
        
        // 显示成功通知
        showNotification('预览生成成功！', 'success');
        
        // 切换到预览步骤
        switchToStep(4);
    }, 2000);
}

// 缩放预览
function zoomPreview(factor, reset = false) {
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return;
    
    const previewManga = previewContent.querySelector('.preview-manga');
    if (!previewManga) return;
    
    let currentZoom = parseFloat(previewManga.style.zoom || 1);
    
    if (reset) {
        currentZoom = 1;
    } else {
        currentZoom *= factor;
        // 限制缩放范围
        currentZoom = Math.max(0.5, Math.min(currentZoom, 3));
    }
    
    previewManga.style.zoom = currentZoom;
    
    // 更新缩放级别显示
    updateZoomLevel(Math.round(currentZoom * 100));
}

// 更新缩放级别显示
function updateZoomLevel(level) {
    const zoomLevel = document.getElementById('zoom-level');
    if (zoomLevel) {
        zoomLevel.textContent = `${level}%`;
    }
}

// 初始化导出
function initializeExport() {
    // 导出按钮
    const exportBtn = document.getElementById('export-manga');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportManga);
    }
    
    // 导出选项
    const exportOptions = document.querySelectorAll('.option-card');
    exportOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有选中状态
            exportOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 添加选中状态
            this.classList.add('selected');
            
            // 更新导出按钮文本
            const format = this.dataset.format;
            const exportBtn = document.getElementById('export-manga');
            if (exportBtn) {
                exportBtn.textContent = `导出为 ${format.toUpperCase()}`;
            }
        });
    });
}

// 导出漫画
function exportManga() {
    // 检查是否有选中的导出格式
    const selectedOption = document.querySelector('.option-card.selected');
    if (!selectedOption) {
        showNotification('请选择导出格式', 'warning');
        return;
    }
    
    const format = selectedOption.dataset.format;
    
    // 显示加载状态
    showNotification(`正在导出为 ${format.toUpperCase()} 格式，请稍候...`, 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        // 添加到导出历史
        const exportItem = {
            format: format,
            date: new Date().toLocaleString(),
            thumbnail: `https://picsum.photos/seed/export-${Date.now()}/48/48.jpg`
        };
        
        exportHistory.unshift(exportItem);
        
        // 更新历史记录显示
        updateExportHistory();
        
        // 显示成功通知
        showNotification(`成功导出为 ${format.toUpperCase()} 格式！`, 'success');
    }, 1500);
}

// 更新导出历史
function updateExportHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    // 清空现有列表
    historyList.innerHTML = '';
    
    // 添加历史记录项
    exportHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const thumbnail = document.createElement('div');
        thumbnail.className = 'history-thumbnail';
        thumbnail.style.backgroundImage = `url(${item.thumbnail})`;
        thumbnail.style.backgroundSize = 'cover';
        thumbnail.style.backgroundPosition = 'center';
        
        const info = document.createElement('div');
        info.className = 'history-info';
        
        const title = document.createElement('h5');
        title.textContent = `漫画导出 (${item.format.toUpperCase()})`;
        
        const date = document.createElement('p');
        date.textContent = item.date;
        
        info.appendChild(title);
        info.appendChild(date);
        
        historyItem.appendChild(thumbnail);
        historyItem.appendChild(info);
        
        historyList.appendChild(historyItem);
    });
}

// 初始化右侧面板
function initializeRightPanel() {
    // 标签切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // 默认显示历史记录标签
    switchTab('history');
}

// 切换标签
function switchTab(tabId) {
    // 更新标签按钮状态
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
    // 更新标签内容显示
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        }
    });
}

// 初始化浮动操作按钮
function initializeFAB() {
    const fab = document.getElementById('fab');
    const fabOptions = document.getElementById('fab-options');
    
    if (fab && fabOptions) {
        fab.addEventListener('click', function() {
            this.classList.toggle('active');
            fabOptions.classList.toggle('show');
        });
        
        // 点击其他地方关闭FAB选项
        document.addEventListener('click', function(e) {
            if (!fab.contains(e.target) && !fabOptions.contains(e.target)) {
                fab.classList.remove('active');
                fabOptions.classList.remove('show');
            }
        });
    }
}

// 加载示例数据
function loadSampleData() {
    // 加载示例模板
    const templateGrid = document.getElementById('template-grid');
    if (templateGrid) {
        const templates = [
            { id: 1, name: '四格漫画', image: 'https://picsum.photos/seed/template1/200/120.jpg' },
            { id: 2, name: '条漫', image: 'https://picsum.photos/seed/template2/200/120.jpg' },
            { id: 3, name: '页漫', image: 'https://picsum.photos/seed/template3/200/120.jpg' },
            { id: 4, name: '动态漫画', image: 'https://picsum.photos/seed/template4/200/120.jpg' }
        ];
        
        templates.forEach(template => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            
            const thumbnail = document.createElement('div');
            thumbnail.className = 'template-thumbnail';
            thumbnail.style.backgroundImage = `url(${template.image})`;
            thumbnail.style.backgroundSize = 'cover';
            thumbnail.style.backgroundPosition = 'center';
            
            const name = document.createElement('p');
            name.textContent = template.name;
            
            templateItem.appendChild(thumbnail);
            templateItem.appendChild(name);
            
            templateGrid.appendChild(templateItem);
        });
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.color = '#fff';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    notification.style.maxWidth = '300px';
    
    // 根据类型设置背景色
    switch (type) {
        case 'success':
            notification.style.backgroundColor = 'var(--success-color)';
            break;
        case 'error':
            notification.style.backgroundColor = 'var(--danger-color)';
            break;
        case 'warning':
            notification.style.backgroundColor = 'var(--warning-color)';
            break;
        default:
            notification.style.backgroundColor = 'var(--info-color)';
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}