// Initialize Lucide Icons
lucide.createIcons();

// Navigation and Section Switching
function showSection(sectionId) {
    const sections = ['home', 'registration', 'dashboard'];
    sections.forEach(s => {
        const el = document.getElementById(`${s}-section`);
        if (el) {
            if (s === sectionId) {
                el.classList.remove('hidden');
                gsap.from(el, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" });
            } else {
                el.classList.add('hidden');
            }
        }
    });

    // Reset navigation scroll state
    window.scrollTo(0, 0);
}

// Multi-step Form Logic
let currentStep = 1;
function nextStep(step) {
    // Hide current step
    document.getElementById(`form-step-${currentStep}`).classList.add('hidden');
    document.getElementById(`step-${currentStep}`).classList.remove('active');

    // Show next step
    currentStep = step;
    document.getElementById(`form-step-${currentStep}`).classList.remove('hidden');
    document.getElementById(`step-${currentStep}`).classList.add('active');

    gsap.from(`#form-step-${currentStep}`, { opacity: 0, x: 20, duration: 0.5 });

    // Special handling for Step 3 (Camera)
    if (step === 3) {
        initCamera();
    }
}

// AI Face ID Simulation
let stream = null;
async function initCamera() {
    const video = document.getElementById('webcam');
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Camera access denied:", err);
        document.getElementById('verification-status').innerText = "Camera access denied. Using simulated feed.";
        // Show a placeholder or simulation if camera is blocked
    }
}

function simulateFaceScan() {
    const status = document.getElementById('verification-status');
    status.innerText = "Analyzing facial features...";
    status.style.color = "var(--accent)";

    gsap.to(".scan-line", { duration: 1, repeat: 3, yoyo: true });

    setTimeout(() => {
        status.innerText = "Matching with Aadhaar Database...";
        setTimeout(() => {
            status.innerText = "Verified Successfully!";
            status.style.color = "#00C851";
            
            // Stop camera stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Generate Plate Number
            generatePlate();

            // Proceed to final step
            setTimeout(() => nextStep(4), 1500);
        }, 2000);
    }, 2000);
}

// Number Plate Generator
function generatePlate() {
    const states = ['TS', 'MH', 'DL', 'KA', 'KA', 'UP', 'HR'];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const districtCode = Math.floor(Math.random() * 99).toString().padStart(2, '0');
    const series = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const randomSeries = series[Math.floor(Math.random() * series.length)] + series[Math.floor(Math.random() * series.length)];
    const uniqueNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    const plate = `${randomState} ${districtCode} ${randomSeries} ${uniqueNum}`;
    document.getElementById('plate-preview').innerText = plate;
}

// Finalization
function finalizeRegistration() {
    alert("Payment successful! Your Digital RC Book is being generated.");
    showSection('dashboard');
    populateDashboard();
}

// Dashboard Data
function populateDashboard() {
    const table = document.getElementById('dashboard-table');
    const mockData = [
        { plate: 'TS 09 AJ 4521', owner: 'Arjun Reddy', type: '4-Wheeler', status: 'Approved' },
        { plate: 'DL 01 CX 9022', owner: 'Priya Sharma', type: '2-Wheeler', status: 'Approved' },
        { plate: 'MH 12 BB 1100', owner: 'Rahul Varma', type: 'Heavy Vehicle', status: 'Pending' },
        { plate: 'KA 03 GH 7788', owner: 'Suresh Kumar', type: '4-Wheeler', status: 'Approved' },
        { plate: 'UP 16 ZE 5544', owner: 'Amit Singh', type: '2-Wheeler', status: 'Rejected' },
    ];

    table.innerHTML = mockData.map(item => `
        <tr style="border-bottom: 1px solid var(--glass-border);">
            <td style="padding: 1rem; font-family: monospace; font-weight: 700;">${item.plate}</td>
            <td style="padding: 1rem;">${item.owner}</td>
            <td style="padding: 1rem;">${item.type}</td>
            <td style="padding: 1rem;">
                <span style="padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; background: ${
                    item.status === 'Approved' ? 'rgba(0, 200, 81, 0.2)' : 
                    item.status === 'Pending' ? 'rgba(255, 187, 51, 0.2)' : 'rgba(255, 68, 68, 0.2)'
                }; color: ${
                    item.status === 'Approved' ? '#00C851' : 
                    item.status === 'Pending' ? '#FFBB33' : '#ff4444'
                };">
                    ${item.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// Initial Population
populateDashboard();

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
