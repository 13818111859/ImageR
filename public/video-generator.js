// AI 视频生成器类
class VideoGenerator {
    constructor() {
        this.currentTask = null;
        this.uploadedImage = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTabs();
    }

    bindEvents() {
        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // 图片上传
        document.getElementById('uploadImageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // 视频生成
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateVideo();
        });

        // 下载视频
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadVideo();
        });

        // 拖拽上传
        const imageDropZone = document.getElementById('imageDropZone');
        imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageDropZone.classList.add('drag-over');
        });

        imageDropZone.addEventListener('dragleave', () => {
            imageDropZone.classList.remove('drag-over');
        });

        imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleImageUpload(file);
            }
        });
    }

    switchTab(tabName) {
        // 隐藏所有标签页
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 显示选中的标签页
        const selectedTab = document.getElementById(`${tabName}Tab`);
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (selectedTab) selectedTab.classList.add('active');
        if (selectedBtn) selectedBtn.classList.add('active');
    }

    async handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择有效的图片文件');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            this.showLoading(true);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '上传失败');
            }

            this.uploadedImage = data.filename;

            // 显示预览
            const preview = document.getElementById('imagePreview');
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);

            // 更新 UI
            document.getElementById('imageInfo').textContent = `已上传: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
            document.getElementById('generateBtn').disabled = false;

            this.showNotification('图片上传成功！', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async generateVideo() {
        if (!this.uploadedImage) {
            alert('请先上传图片');
            return;
        }

        const prompt = document.getElementById('promptInput').value.trim();
        const duration = parseInt(document.getElementById('durationSelect').value);
        const style = document.getElementById('styleSelect').value;

        if (!prompt) {
            alert('请输入视频描述');
            return;
        }

        try {
            this.showLoading(true);
            document.getElementById('generateBtn').disabled = true;

            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageFile: this.uploadedImage,
                    prompt,
                    duration,
                    style
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '生成失败');
            }

            this.currentTask = data.taskId;
            this.showNotification('视频生成已开始...', 'info');
            
            // 切换到进度标签页
            this.switchTab('progress');
            
            // 开始监测进度
            this.pollTaskProgress();
        } catch (error) {
            this.showNotification(error.message, 'error');
            document.getElementById('generateBtn').disabled = false;
        } finally {
            this.showLoading(false);
        }
    }

    async pollTaskProgress() {
        if (!this.currentTask) return;

        try {
            const response = await fetch(`/api/task/${this.currentTask}`);
            const data = await response.json();
            const task = data.task;

            // 更新进度条
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            
            progressBar.style.width = task.progress + '%';
            progressText.textContent = `${task.progress}%`;

            // 更新状态
            const statusEl = document.getElementById('statusText');
            statusEl.textContent = this.getStatusText(task.status);

            if (task.status === 'completed') {
                this.showNotification('视频生成完成！', 'success');
                document.getElementById('downloadBtn').disabled = false;
                this.currentTask = null;
            } else if (task.status === 'failed') {
                this.showNotification(`生成失败: ${task.error}`, 'error');
                this.currentTask = null;
            } else {
                // 继续轮询
                setTimeout(() => this.pollTaskProgress(), 1000);
            }
        } catch (error) {
            console.error('轮询错误:', error);
        }
    }

    getStatusText(status) {
        const statusMap = {
            processing: '处理中...',
            completed: '✅ 已完成',
            failed: '❌ 失败',
            queued: '⏳ 队列中'
        };
        return statusMap[status] || '未知';
    }

    async downloadVideo() {
        if (!this.currentTask) {
            alert('没有可下载的视频');
            return;
        }

        try {
            const response = await fetch(`/api/task/${this.currentTask}`);
            const data = await response.json();
            const videoFile = data.task.videoFile;

            if (!videoFile) {
                alert('视频文件不可用');
                return;
            }

            window.location.href = `/api/download/${videoFile}`;
        } catch (error) {
            alert('下载失败: ' + error.message);
        }
    }

    loadTabs() {
        document.querySelectorAll('.tab-btn').forEach((btn, index) => {
            if (index === 0) {
                btn.classList.add('active');
            }
        });
        document.querySelectorAll('.tab-content').forEach((tab, index) => {
            if (index === 0) {
                tab.classList.add('active');
            }
        });
    }

    showLoading(show) {
        const loading = document.getElementById('globalLoading');
        if (show) {
            loading.style.display = 'flex';
        } else {
            loading.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new VideoGenerator();
});