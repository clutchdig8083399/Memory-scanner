document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const processSelect = document.getElementById('process-select');
    const pidInput = document.getElementById('pid-input');
    const refreshProcessesBtn = document.getElementById('refresh-processes');
    const connectBtn = document.getElementById('connect-button');
    const firstScanBtn = document.getElementById('first-scan');
    const nextScanBtn = document.getElementById('next-scan');
    const resetScanBtn = document.getElementById('reset-scan');
    const resultsOutput = document.getElementById('results-output');
    const resultCount = document.getElementById('result-count');
    const memoryUsage = document.getElementById('memory-usage');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const memoryMap = document.getElementById('memory-map');

    // Application state
    let isConnected = false;
    let scanResults = [];
    let scanInProgress = false;

    // Event listeners
    refreshProcessesBtn.addEventListener('click', refreshProcessList);
    connectBtn.addEventListener('click', toggleConnection);
    firstScanBtn.addEventListener('click', performFirstScan);
    nextScanBtn.addEventListener('click', performNextScan);
    resetScanBtn.addEventListener('click', resetScan);
    
    // Initialize memory blocks visualization
    generateMemoryBlocks();

    // Functions
    function refreshProcessList() {
        // Simulate process list refresh
        const processes = [
            { name: 'chrome.exe', pid: '1234' },
            { name: 'firefox.exe', pid: '2345' },
            { name: 'notepad.exe', pid: '3456' },
            { name: 'game.exe', pid: '4567' },
            { name: 'explorer.exe', pid: '5678' }
        ];
        
        // Clear existing options
        while (processSelect.options.length > 1) {
            processSelect.remove(1);
        }
        
        // Add new options
        processes.forEach(process => {
            const option = document.createElement('option');
            option.value = process.name;
            option.textContent = `${process.name} (PID: ${process.pid})`;
            processSelect.appendChild(option);
        });
        
        updateStatus('Process list refreshed', false);
    }
    
    function toggleConnection() {
        if (isConnected) {
            // Disconnect
            isConnected = false;
            connectBtn.textContent = 'Connect to Target';
            statusDot.className = 'status-dot status-disconnected';
            statusText.textContent = 'Disconnected';
            firstScanBtn.disabled = true;
            updateStatus('Disconnected from target process', false);
        } else {
            // Connect
            const selectedProcess = processSelect.value;
            const manualPid = pidInput.value.trim();
            
            if (!selectedProcess && !manualPid) {
                updateStatus('Please select a process or enter a PID', true);
                return;
            }
            
            isConnected = true;
            connectBtn.textContent = 'Disconnect';
            statusDot.className = 'status-dot status-connected';
            statusText.textContent = 'Connected';
            firstScanBtn.disabled = false;
            
            const processName = selectedProcess || `PID: ${manualPid}`;
            updateStatus(`Connected to ${processName}`, false);
        }
    }
    
    function performFirstScan() {
        if (!isConnected) {
            updateStatus('Not connected to any process', true);
            return;
        }
        
        const scanValue = document.getElementById('scan-value').value;
        const scanType = document.getElementById('scan-type').value;
        const valueType = document.getElementById('value-type').value;
        
        if (scanType !== 'unknown' && !scanValue) {
            updateStatus('Please enter a value to scan for', true);
            return;
        }
        
        // Start scanning animation
        scanInProgress = true;
        statusDot.className = 'status-dot status-scanning';
