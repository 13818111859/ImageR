// 图像编辑器主类
class ImageEditor {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.originalImage = null;
        this.currentImage = null;
        this.rotation = 0;
        this.flipH = 1;
        this.flipV = 1;
        
        // 滤镜值
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0,
            blur: 0,
            grayscale: 0,
            sepia: 0,
            invert: 0
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateUI();
    }
    
    bindEvents() {
        // 文件上传
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFile(e.target.files[0]);
        });
        
        // 拖拽上传
        const container = document.getElementById('canvasContainer');
        const placeholder = document.getElementById('uploadPlaceholder');
        
        placeholder.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            placeholder.classList.add('drag-over');
        });
        
        container.addEventListener('dragleave', () => {
            placeholder.classList.remove('drag-over');
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            placeholder.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFile(file);
            }
        });
        
        // 滑块控制
        const sliders = ['brightness', 'contrast', 'saturation', 'hue', 'blur', 'grayscale', 'sepia', 'invert'];
        sliders.forEach(id => {
            const slider = document.getElementById(id);
            slider.addEventListener('input', () => {
                this.filters[id] = parseInt(slider.value);
                this.updateSliderValue(id, slider.value);
                this.applyFilters();
            });
        });
        
        // 预设滤镜
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyPresetFilter(btn.dataset.filter);
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 变换操作
        document.getElementById('rotateLeft').addEventListener('click', () => this.rotate(-90));
        document.getElementById('rotateRight').addEventListener('click', () => this.rotate(90));
        document.getElementById('flipH').addEventListener('click', () => this.flip('horizontal'));
        document.getElementById('flipV').addEventListener('click', () => this.flip('vertical'));
        
        // 特效
        document.getElementById('sharpenBtn').addEventListener('click', () => this.applyEffect('sharpen'));
        document.getElementById('edgeBtn').addEventListener('click', () => this.applyEffect('edge'));
        document.getElementById('embossBtn').addEventListener('click', () => this.applyEffect('emboss'));
        document.getElementById('pixelateBtn').addEventListener('click', () => this.applyEffect('pixelate'));
        document.getElementById('noiseBtn').addEventListener('click', () => this.applyEffect('noise'));
        document.getElementById('vignetteBtn').addEventListener('click', () => this.applyEffect('vignette'));
        
        // 下载和重置
        document.getElementById('downloadBtn').addEventListener('click', () => this.download());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }
    
    handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择有效的图片文件');
            return;
        }
        
        this.showLoading(true);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.currentImage = img;
                this.rotation = 0;
                this.flipH = 1;
                this.flipV = 1;
                this.resetFilters();
                this.render();
                this.showLoading(false);
                this.updateUI();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    resetFilters() {
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0,
            blur: 0,
            grayscale: 0,
            sepia: 0,
            invert: 0
        };
        
        // 更新滑块
        Object.keys(this.filters).forEach(key => {
            const slider = document.getElementById(key);
            if (slider) {
                slider.value = this.filters[key];
                this.updateSliderValue(key, this.filters[key]);
            }
        });
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    }
    
    updateSliderValue(id, value) {
        const span = document.getElementById(id + 'Value');
        if (span) {
            if (id === 'hue') {
                span.textContent = value + '°';
            } else if (id === 'blur') {
                span.textContent = value + 'px';
            } else {
                span.textContent = value + '%';
            }
        }
    }
    
    applyFilters() {
        if (!this.currentImage) return;
        this.render();
    }
    
    getFilterString() {
        const f = this.filters;
        return `
            brightness(${f.brightness}%)
            contrast(${f.contrast}%)
            saturate(${f.saturation}%)
            hue-rotate(${f.hue}deg)
            blur(${f.blur}px)
            grayscale(${f.grayscale}%)
            sepia(${f.sepia}%)
            invert(${f.invert}%)
        `;
    }
    
    render() {
        if (!this.currentImage) return;
        
        const img = this.currentImage;
        
        // 根据旋转角度调整画布尺寸
        if (this.rotation % 180 === 0) {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
        } else {
            this.canvas.width = img.height;
            this.canvas.height = img.width;
        }
        
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 保存上下文
        this.ctx.save();
        
        // 移动到画布中心
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        
        // 应用旋转
        this.ctx.rotate((this.rotation * Math.PI) / 180);
        
        // 应用翻转
        this.ctx.scale(this.flipH, this.flipV);
        
        // 应用滤镜
        this.ctx.filter = this.getFilterString();
        
        // 绘制图像
        this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        // 恢复上下文
        this.ctx.restore();
        
        // 更新信息显示
        this.updateInfo();
    }
    
    applyPresetFilter(filterName) {
        const presets = {
            normal: { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
            warm: { brightness: 105, contrast: 110, saturation: 120, hue: 10, blur: 0, grayscale: 0, sepia: 20, invert: 0 },
            cool: { brightness: 100, contrast: 105, saturation: 90, hue: 180, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
            vintage: { brightness: 90, contrast: 85, saturation: 80, hue: 0, blur: 0, grayscale: 0, sepia: 50, invert: 0 },
            bw: { brightness: 100, contrast: 120, saturation: 0, hue: 0, blur: 0, grayscale: 100, sepia: 0, invert: 0 },
            dramatic: { brightness: 110, contrast: 150, saturation: 110, hue: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
            cyberpunk: { brightness: 110, contrast: 130, saturation: 150, hue: 280, blur: 0, grayscale: 0, sepia: 0, invert: 10 },
            dream: { brightness: 115, contrast: 90, saturation: 110, hue: 0, blur: 2, grayscale: 0, sepia: 10, invert: 0 }
        };
        
        if (presets[filterName]) {
            this.filters = { ...presets[filterName] };
            Object.keys(this.filters).forEach(key => {
                const slider = document.getElementById(key);
                if (slider) {
                    slider.value = this.filters[key];
                    this.updateSliderValue(key, this.filters[key]);
                }
            });
            this.applyFilters();
        }
    }
    
    rotate(degrees) {
        this.rotation = (this.rotation + degrees) % 360;
        this.render();
    }
    
    flip(direction) {
        if (direction === 'horizontal') {
            this.flipH *= -1;
        } else {
            this.flipV *= -1;
        }
        this.render();
    }
    
    applyEffect(effect) {
        if (!this.currentImage) return;
        
        this.showLoading(true);
        
        // 使用 setTimeout 让加载动画显示
        setTimeout(() => {
            const width = this.canvas.width;
            const height = this.canvas.height;
            const imageData = this.ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            switch (effect) {
                case 'sharpen':
                    this.applyConvolution([
                        0, -1, 0,
                        -1, 5, -1,
                        0, -1, 0
                    ]);
                    break;
                    
                case 'edge':
                    this.applyConvolution([
                        -1, -1, -1,
                        -1, 8, -1,
                        -1, -1, -1
                    ]);
                    break;
                    
                case 'emboss':
                    this.applyConvolution([
                        -2, -1, 0,
                        -1, 1, 1,
                        0, 1, 2
                    ]);
                    break;
                    
                case 'pixelate':
                    this.applyPixelate(10);
                    break;
                    
                case 'noise':
                    this.applyNoise(30);
                    break;
                    
                case 'vignette':
                    this.applyVignette();
                    break;
            }
            
            this.showLoading(false);
        }, 100);
    }
    
    applyConvolution(kernel) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const srcData = this.ctx.getImageData(0, 0, width, height);
        const dstData = this.ctx.createImageData(width, height);
        const src = srcData.data;
        const dst = dstData.data;
        
        const side = Math.round(Math.sqrt(kernel.length));
        const half = Math.floor(side / 2);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;
                
                for (let cy = 0; cy < side; cy++) {
                    for (let cx = 0; cx < side; cx++) {
                        const scy = y + cy - half;
                        const scx = x + cx - half;
                        
                        if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                            const srcOffset = (scy * width + scx) * 4;
                            const wt = kernel[cy * side + cx];
                            r += src[srcOffset] * wt;
                            g += src[srcOffset + 1] * wt;
                            b += src[srcOffset + 2] * wt;
                        }
                    }
                }
                
                const dstOffset = (y * width + x) * 4;
                dst[dstOffset] = Math.min(255, Math.max(0, r));
                dst[dstOffset + 1] = Math.min(255, Math.max(0, g));
                dst[dstOffset + 2] = Math.min(255, Math.max(0, b));
                dst[dstOffset + 3] = src[dstOffset + 3];
            }
        }
        
        this.ctx.putImageData(dstData, 0, 0);
    }
    
    applyPixelate(size) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 创建临时画布
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = Math.ceil(width / size);
        tempCanvas.height = Math.ceil(height / size);
        
        // 缩小
        tempCtx.drawImage(this.canvas, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // 放大回来
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.drawImage(tempCanvas, 0, 0, width, height);
        this.ctx.imageSmoothingEnabled = true;
    }
    
    applyNoise(amount) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * amount;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    applyVignette() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
        
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const factor = 1 - (dist / maxDist) * 0.5;
                
                const idx = (y * width + x) * 4;
                data[idx] *= factor;
                data[idx + 1] *= factor;
                data[idx + 2] *= factor;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    download() {
        if (!this.currentImage) return;
        
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
    
    reset() {
        if (!this.originalImage) return;
        
        this.currentImage = this.originalImage;
        this.rotation = 0;
        this.flipH = 1;
        this.flipV = 1;
        this.resetFilters();
        this.render();
    }
    
    updateUI() {
        const hasImage = !!this.currentImage;
        document.getElementById('downloadBtn').disabled = !hasImage;
        document.getElementById('resetBtn').disabled = !hasImage;
        
        const placeholder = document.getElementById('uploadPlaceholder');
        const canvas = document.getElementById('canvas');
        const canvasInfo = document.getElementById('canvasInfo');
        
        if (hasImage) {
            placeholder.hidden = true;
            canvas.hidden = false;
            canvasInfo.hidden = false;
        } else {
            placeholder.hidden = false;
            canvas.hidden = true;
            canvasInfo.hidden = true;
        }
    }
    
    updateInfo() {
        const size = document.getElementById('imageSize');
        size.textContent = `${this.canvas.width} × ${this.canvas.height} px`;
    }
    
    showLoading(show) {
        document.getElementById('loading').hidden = !show;
    }
}

// 初始化
const editor = new ImageEditor();
