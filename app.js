// app.js
class QRScannerApp {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.scanner = null;
        this.isScanning = false;
        this.scanInterval = null;
        this.torchSupported = false;
        this.currentCamera = 'environment';
        
        this.codes = JSON.parse(localStorage.getItem('qrCodes') || '[]');
        this.settings = JSON.parse(localStorage.getItem('settings') || '{}');
        
        // 添加預設條碼
        if (this.codes.length === 0) {
            this.initializeDefaultCodes();
        }
        
        this.initializeSettings();
        this.setupEventListeners();
        this.checkDisclaimer();
        this.showPage('homePage');
    }

    initializeSettings() {
        const defaultSettings = {
            autoCompare: true,
            soundAlert: true,
            vibrateAlert: true,
            scanFrequency: 200
        };
        
        this.settings = { ...defaultSettings, ...this.settings };
        this.updateSettingsUI();
    }

    initializeDefaultCodes() {
        const now = Date.now();
        const defaultCodes = [
            {
                id: now.toString(),
                content: '251103C',
                name: '四日鮮蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 1).toString(),
                content: '251103C',
                name: '巨的卵',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 2).toString(),
                content: '251023C',
                name: '大巨蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 3).toString(),
                content: '251027C',
                name: '大巨蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 4).toString(),
                content: '251030C',
                name: '大巨蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 5).toString(),
                content: '251103C',
                name: '大巨蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 6).toString(),
                content: '251023C',
                name: '悠活鮮蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 7).toString(),
                content: '251023C',
                name: '富翁洗選蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 8).toString(),
                content: '251030C',
                name: '富翁洗選蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 9).toString(),
                content: '251023C',
                name: '初卵頭窩蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 10).toString(),
                content: '251023C',
                name: '四季巨蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 11).toString(),
                content: '251027C',
                name: '香草園洗選蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 12).toString(),
                content: '251103C',
                name: '香草園洗選蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 13).toString(),
                content: '251027C',
                name: '鮮健蛋品洗選蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 14).toString(),
                content: '251030C',
                name: '鮮健蛋品洗選蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            },
            {
                id: (now + 15).toString(),
                content: '251103C',
                name: '鮮健蛋品洗選蛋',
                note: '資料來源：衛生福利部食品藥物管理署 - www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=31288',
                created: new Date(now).toISOString(),
                lastModified: new Date(now).toISOString()
            }
        ];
        
        this.codes = defaultCodes;
        this.saveCodes();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...'); // 除錯訊息
        
        // 首頁按鈕
        document.getElementById('startScanBtn').addEventListener('click', () => this.showPage('scanPage'));
        document.getElementById('manageCodesBtn').addEventListener('click', () => this.showPage('managePage'));
        document.getElementById('settingsBtn').addEventListener('click', () => this.showPage('settingsPage'));
        
        // 掃描頁面按鈕
        document.getElementById('torchBtn').addEventListener('click', () => this.toggleTorch());
        document.getElementById('cameraBtn').addEventListener('click', () => this.switchCamera());
        
        // 結果頁面按鈕
        document.getElementById('newCodeBtn').addEventListener('click', () => this.newCodeFromResult());
        document.getElementById('backToScanBtn').addEventListener('click', () => this.showPage('scanPage'));
        document.getElementById('backToHomeBtn2').addEventListener('click', () => this.showPage('homePage'));
        
        // 管理頁面按鈕
        document.getElementById('addNewCodeBtn').addEventListener('click', () => this.showEditPage());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterCodes(e.target.value));
        
        // 編輯頁面按鈕
        document.getElementById('saveCodeBtn').addEventListener('click', () => this.saveCode());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.showPage('managePage'));
        
        // 設定頁面按鈕
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
        document.getElementById('resetDataBtn').addEventListener('click', () => this.resetData());
        
        // 模態框按鈕
        document.getElementById('closeAlertBtn').addEventListener('click', () => this.hideModal('alertModal'));
        document.getElementById('confirmYesBtn').addEventListener('click', () => this.confirmYes());
        document.getElementById('confirmNoBtn').addEventListener('click', () => this.hideModal('confirmModal'));
        document.getElementById('acceptDisclaimerBtn').addEventListener('click', () => this.acceptDisclaimer());
        
        // 設定變更事件
        document.getElementById('autoCompare').addEventListener('change', (e) => this.updateSetting('autoCompare', e.target.checked));
        document.getElementById('soundAlert').addEventListener('change', (e) => this.updateSetting('soundAlert', e.target.checked));
        document.getElementById('vibrateAlert').addEventListener('change', (e) => this.updateSetting('vibrateAlert', e.target.checked));
        document.getElementById('scanFrequency').addEventListener('change', (e) => this.updateSetting('scanFrequency', parseInt(e.target.value)));
        
        // 為所有左上角返回按鈕添加事件監聽器
        this.setupBackButtonListeners();
        
        // 使用事件委託處理動態生成的條碼列表按鈕
        this.setupCodeListEventDelegation();
    }
    
    setupCodeListEventDelegation() {
        console.log('Setting up code list event delegation...'); // 除錯訊息
        
        // 為代碼列表容器添加事件監聽器
        const codeListContainer = document.getElementById('codeList');
        if (codeListContainer) {
            codeListContainer.addEventListener('click', (event) => {
                const target = event.target;
                console.log('Code list clicked:', target); // 除錯訊息
                
                // 檢查是否點擊了編輯按鈕
                if (target.classList.contains('code-btn-edit')) {
                    console.log('Edit button clicked'); // 除錯訊息
                    const codeItem = target.closest('.code-item');
                    const codeId = codeItem?.dataset?.codeId;
                    if (codeId) {
                        this.editCode(codeId);
                    }
                }
                // 檢查是否點擊了複製按鈕
                else if (target.classList.contains('code-btn-copy')) {
                    console.log('Copy button clicked'); // 除錯訊息
                    const codeItem = target.closest('.code-item');
                    const codeId = codeItem?.dataset?.codeId;
                    if (codeId) {
                        this.copyCode(codeId);
                    }
                }
                // 檢查是否點擊了刪除按鈕
                else if (target.classList.contains('code-btn-delete')) {
                    console.log('Delete button clicked'); // 除錯訊息
                    const codeItem = target.closest('.code-item');
                    const codeId = codeItem?.dataset?.codeId;
                    if (codeId) {
                        this.deleteCode(codeId);
                    }
                }
            });
        }
    }
    
    setupBackButtonListeners() {
        console.log('Setting up back button listeners...'); // 除錯訊息
        
        // 尋找所有back-btn按鈕並添加事件監聽器
        const backButtons = document.querySelectorAll('.back-btn');
        console.log('Found back buttons:', backButtons.length); // 除錯訊息
        
        backButtons.forEach((button, index) => {
            console.log(`Setting up back button ${index}:`, button); // 除錯訊息
            
            // 移除現有的onclick屬性
            button.removeAttribute('onclick');
            
            // 添加新的事件監聽器
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log('Back button clicked:', index, button.textContent); // 除錯訊息
                
                // 根據按鈕文字或父頁面決定目標頁面
                const buttonText = button.textContent.trim();
                console.log('Button text:', buttonText); // 除錯訊息
                
                if (buttonText === '首頁') {
                    this.showPage('homePage');
                } else if (buttonText === '返回') {
                    // 判斷當前頁面來決定返回哪裡
                    const currentPage = document.querySelector('.page:not(.hidden)');
                    if (currentPage && currentPage.id === 'resultPage') {
                        this.showPage('scanPage');
                    } else if (currentPage && currentPage.id === 'editPage') {
                        this.showPage('managePage');
                    } else {
                        this.showPage('homePage');
                    }
                } else {
                    this.showPage('homePage'); // 預設返回首頁
                }
            });
        });
    }

    updateSettingsUI() {
        document.getElementById('autoCompare').checked = this.settings.autoCompare;
        document.getElementById('soundAlert').checked = this.settings.soundAlert;
        document.getElementById('vibrateAlert').checked = this.settings.vibrateAlert;
        document.getElementById('scanFrequency').value = this.settings.scanFrequency;
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    checkDisclaimer() {
        const disclaimerAccepted = localStorage.getItem('disclaimerAccepted');
        if (!disclaimerAccepted) {
            document.getElementById('disclaimerModal').classList.remove('hidden');
        }
    }

    acceptDisclaimer() {
        localStorage.setItem('disclaimerAccepted', 'true');
        this.hideModal('disclaimerModal');
    }

    showPage(pageId) {
        console.log('QRScannerApp.showPage called with:', pageId); // 除錯訊息
        
        // 停止當前掃描
        if (this.isScanning && pageId !== 'scanPage') {
            console.log('Stopping current scanning...'); // 除錯訊息
            this.stopScanning();
        }
        
        console.log('Hiding all pages...'); // 除錯訊息
        document.querySelectorAll('.page').forEach(page => {
            console.log('Hiding page:', page.id); // 除錯訊息
            page.classList.add('hidden');
        });
        
        console.log('Showing page:', pageId); // 除錯訊息
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            console.log('Page shown successfully:', pageId); // 除錯訊息
        } else {
            console.error('Page not found:', pageId); // 除錯訊息
        }
        
        if (pageId === 'scanPage') {
            console.log('Starting scanning...'); // 除錯訊息
            this.startScanning();
        } else if (pageId === 'managePage') {
            console.log('Rendering code list...'); // 除錯訊息
            this.renderCodeList();
        }
    }

    async startScanning() {
        if (this.isScanning) return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this.currentCamera }
            });
            
            this.video.srcObject = stream;
            this.isScanning = true;
            
            // 檢查閃光燈支援
            this.checkTorchSupport(stream);
            
            this.startScanLoop();
        } catch (error) {
            this.showAlert('相機存取失敗', `請允許相機存取權限：${error.message}`);
        }
    }

    checkTorchSupport(stream) {
        const track = stream.getVideoTracks()[0];
        if (track.getCapabilities) {
            const capabilities = track.getCapabilities();
            this.torchSupported = 'torch' in capabilities;
        }
    }

    startScanLoop() {
        this.scanInterval = setInterval(() => {
            if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                this.scanFrame();
            }
        }, this.settings.scanFrequency);
    }

    scanFrame() {
        const video = this.video;
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
            this.stopScanning(() => {
                this.handleScanResult(code.data);
            });
        }
    }

    stopScanning(callback = null) {
        this.isScanning = false;
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
        }
        
        if (callback) callback();
    }

    handleScanResult(codeData) {
        let matchedCode = null;
        if (this.settings.autoCompare) {
            matchedCode = this.codes.find(code => codeData.includes(code.content));
        }
        
        if (matchedCode) {
            this.showAlert('⚠️ 發現匹配條碼！', `匹配到：${matchedCode.name || matchedCode.content}`);
            this.playAlertSound();
            this.vibrateAlert();
        } else {
            this.showAlert('未匹配到儲存條碼', '此條碼不在您的清單中');
        }
        
        document.getElementById('resultCode').textContent = codeData;
        document.getElementById('resultStatus').textContent = matchedCode ? '匹配到儲存條碼' : '未匹配到儲存條碼';
        document.getElementById('resultStatus').className = `result-status ${matchedCode ? 'match' : 'no-match'}`;
        
        this.showPage('resultPage');
    }

    playAlertSound() {
        if (this.settings.soundAlert) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }

    vibrateAlert() {
        if (this.settings.vibrateAlert && navigator.vibrate) {
            navigator.vibrate([100]);
        }
    }

    toggleTorch() {
        if (!this.torchSupported) {
            this.showAlert('不支援閃光燈', '此裝置不支援閃光燈功能');
            return;
        }
        
        const tracks = this.video.srcObject.getVideoTracks();
        if (tracks.length > 0) {
            const track = tracks[0];
            track.applyConstraints({
                advanced: [{ torch: !track.getSettings().torch }]
            }).catch(err => {
                this.showAlert('閃光燈控制失敗', err.message);
            });
        }
    }

    switchCamera() {
        this.currentCamera = this.currentCamera === 'environment' ? 'user' : 'environment';
        this.stopScanning(() => {
            this.startScanning();
        });
    }

    newCodeFromResult() {
        const codeData = document.getElementById('resultCode').textContent;
        this.showEditPage(codeData);
    }

    showEditPage(codeData = null, editCode = null) {
        document.getElementById('editTitle').textContent = editCode ? '編輯條碼' : '新增條碼';
        
        if (editCode) {
            document.getElementById('codeContent').value = editCode.content;
            document.getElementById('codeName').value = editCode.name || '';
            document.getElementById('codeNote').value = editCode.note || '';
        } else {
            document.getElementById('codeContent').value = codeData || '';
            document.getElementById('codeName').value = '';
            document.getElementById('codeNote').value = '';
        }
        
        this.currentEditCode = editCode;
        this.showPage('editPage');
    }

    saveCode() {
        const content = document.getElementById('codeContent').value.trim();
        const name = document.getElementById('codeName').value.trim();
        const note = document.getElementById('codeNote').value.trim();
        
        if (!content) {
            this.showAlert('錯誤', '請輸入條碼內容');
            return;
        }
        
        const now = new Date().toISOString();
        
        if (this.currentEditCode) {
            // 編輯現有條碼
            const index = this.codes.findIndex(code => code.id === this.currentEditCode.id);
            if (index !== -1) {
                this.codes[index] = {
                    ...this.codes[index],
                    content,
                    name,
                    note,
                    lastModified: now
                };
            }
        } else {
            // 新增條碼
            const newCode = {
                id: Date.now().toString(),
                content,
                name,
                note,
                created: now,
                lastModified: now
            };
            this.codes.push(newCode);
        }
        
        this.saveCodes();
        this.showPage('managePage');
        this.showAlert('成功', '條碼已儲存');
    }

    saveCodes() {
        localStorage.setItem('qrCodes', JSON.stringify(this.codes));
    }

    renderCodeList(searchTerm = '') {
        const codeList = document.getElementById('codeList');
        codeList.innerHTML = '';
        
        const filteredCodes = this.codes.filter(code =>
            code.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (code.name && code.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (code.note && code.note.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        filteredCodes.forEach(code => {
            const codeItem = document.createElement('div');
            codeItem.className = 'code-item';
            codeItem.dataset.codeId = code.id; // 添加 data-code-id 屬性
            codeItem.innerHTML = `
                <div class="code-item-header">
                    <div class="code-item-name">${code.name || '未命名'}</div>
                    <div class="code-item-actions">
                        <button class="code-btn code-btn-edit">編輯</button>
                        <button class="code-btn code-btn-copy">複製</button>
                        <button class="code-btn code-btn-delete">刪除</button>
                    </div>
                </div>
                <div class="code-item-content">${code.content}</div>
                <div class="code-item-note">${code.note || ''}</div>
                <div class="code-item-time">建立: ${new Date(code.created).toLocaleString()}</div>
            `;
            codeList.appendChild(codeItem);
        });
    }

    filterCodes(searchTerm) {
        this.renderCodeList(searchTerm);
    }

    editCode(codeId) {
        const code = this.codes.find(c => c.id === codeId);
        if (code) {
            this.showEditPage(null, code);
        }
    }

    copyCode(codeId) {
        const code = this.codes.find(c => c.id === codeId);
        if (code) {
            navigator.clipboard.writeText(code.content).then(() => {
                this.showAlert('已複製', '條碼內容已複製到剪貼簿');
            });
        }
    }

    deleteCode(codeId) {
        this.currentDeleteCodeId = codeId;
        this.showConfirm('確認刪除', '確定要刪除此條碼嗎？此操作無法復原。');
    }

    confirmYes() {
        if (this.currentDeleteCodeId) {
            this.codes = this.codes.filter(code => code.id !== this.currentDeleteCodeId);
            this.saveCodes();
            this.renderCodeList();
            this.hideModal('confirmModal');
            this.showAlert('已刪除', '條碼已刪除');
        } else if (this.currentAction === 'reset') {
            this.confirmReset();
        }
    }

    exportData() {
        const data = {
            codes: this.codes,
            settings: this.settings,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-codes-backup-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.codes) {
                    this.codes = data.codes;
                    this.saveCodes();
                }
                if (data.settings) {
                    this.settings = { ...this.settings, ...data.settings };
                    localStorage.setItem('settings', JSON.stringify(this.settings));
                    this.updateSettingsUI();
                }
                this.showAlert('匯入成功', '資料已成功匯入');
                this.renderCodeList();
            } catch (error) {
                this.showAlert('匯入失敗', '檔案格式錯誤：' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    resetData() {
        this.showConfirm('確認重置', '確定要重置所有資料嗎？此操作無法復原。');
        this.currentAction = 'reset';
    }

    confirmReset() {
        this.codes = [];
        this.saveCodes();
        this.showAlert('已重置', '所有資料已清除');
        this.renderCodeList();
        this.hideModal('confirmModal');
        this.currentAction = null;
    }

    showAlert(title, message) {
        document.getElementById('alertTitle').textContent = title;
        document.getElementById('alertMessage').textContent = message;
        document.getElementById('alertModal').classList.remove('hidden');
    }

    showConfirm(title, message) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').classList.remove('hidden');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }
}

// 全局showPage函數，供HTML中的onclick使用
function showPage(pageId) {
    console.log('showPage called with:', pageId); // 除錯訊息
    if (window.app) {
        window.app.showPage(pageId);
    } else {
        console.log('window.app not found'); // 除錯訊息
    }
}

// 確保DOM載入完成後初始化應用程式
function initializeApp() {
    console.log('Initializing app...'); // 除錯訊息
    const app = new QRScannerApp();
    window.app = app; // 將app實例暴露到全局作用域
    console.log('App initialized:', window.app); // 除錯訊息
}

// 處理頁面卸載時停止掃描
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.stopScanning();
    }
});

// DOM載入完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}