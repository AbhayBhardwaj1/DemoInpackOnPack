// ==========================================
// InPackOnPack Web Wireframes App Logic
// ==========================================

// Global state variables
let currentMode = 'canvas';
let activeScreenId = '01_splash';
let zoom = 0.6; // zoomed out a bit by default for 1280px wide desktop viewports
let panX = 40;
let panY = 40;
let isPanning = false;
let startX, startY;
let showHotspots = true;
let isAdmin = false;

// Local Interactive Screen States (State management for items like Scratch Card or Redeeming)
const screenStates = {
    '07_instant_win': { revealed: false },
    '10_redeem': { step: 'detail' }, // 'detail', 'confirming', 'completed'
    '18_reward_rules': { doublePoints: false }
};

// Common consumer portal sidebar hotspots (used on pages 04, 08, 09, 11, 12, 13)
const consumerSidebarHotspots = [
    { top: '15%', left: '1.2%', width: '16.5%', height: '5.5%', target: '04_dashboard', label: 'Sidebar Dashboard' },
    { top: '21%', left: '1.2%', width: '16.5%', height: '5.5%', target: '05_scan_qr', label: 'Sidebar Scan QR' },
    { top: '27%', left: '1.2%', width: '16.5%', height: '5.5%', target: '08_wallet', label: 'Sidebar My Wallet' },
    { top: '33%', left: '1.2%', width: '16.5%', height: '5.5%', target: '09_rewards', label: 'Sidebar Rewards Store' },
    { top: '39%', left: '1.2%', width: '16.5%', height: '5.5%', target: '11_nutrition', label: 'Sidebar Nutrition/Eco' },
    { top: '45%', left: '1.2%', width: '16.5%', height: '5.5%', target: '12_history', label: 'Sidebar Activity History' },
    { top: '51%', left: '1.2%', width: '16.5%', height: '5.5%', target: '13_profile', label: 'Sidebar User Profile' },
    { top: '57%', left: '1.2%', width: '16.5%', height: '5.5%', target: '14_admin_dashboard', label: 'Sidebar Switch to Admin' },
    { top: '63%', left: '1.2%', width: '16.5%', height: '5.5%', target: '20_settings', label: 'Sidebar System Settings' }
];

// Common admin portal sidebar hotspots (used on pages 14, 15, 16, 17, 18, 19)
const adminSidebarHotspots = [
    { top: '15%', left: '1.2%', width: '16.5%', height: '5.5%', target: '14_admin_dashboard', label: 'Admin Sidebar Dashboard' },
    { top: '21%', left: '1.2%', width: '16.5%', height: '5.5%', target: '15_product_management', label: 'Admin Sidebar Products' },
    { top: '27%', left: '1.2%', width: '16.5%', height: '5.5%', target: '16_qr_management', label: 'Admin Sidebar QR Batches' },
    { top: '33%', left: '1.2%', width: '16.5%', height: '5.5%', target: '17_users', label: 'Admin Sidebar Users List' },
    { top: '39%', left: '1.2%', width: '16.5%', height: '5.5%', target: '18_reward_rules', label: 'Admin Sidebar Rules Editor' },
    { top: '45%', left: '1.2%', width: '16.5%', height: '5.5%', target: '19_reports', label: 'Admin Sidebar Analytics' },
    { top: '51%', left: '1.2%', width: '16.5%', height: '5.5%', target: '04_dashboard', label: 'Admin Sidebar User Portal' },
    { top: '57%', left: '1.2%', width: '16.5%', height: '5.5%', target: '20_settings', label: 'Admin Sidebar Settings' }
];

// 20 Widescreen Desktop screen definitions
const screens = [
    {
        id: '01_splash',
        name: '01 Splash Landing',
        type: 'user',
        url: 'https://inpackonpack.com/splash',
        hotspots: [
            { top: '52%', left: '55%', width: '14%', height: '7%', target: '02_login', label: 'Get Started Button' },
            { top: '3%', left: '88%', width: '8%', height: '5%', target: '02_login', label: 'Top Nav Login' }
        ]
    },
    {
        id: '02_login',
        name: '02 Login Page',
        type: 'user',
        url: 'https://inpackonpack.com/login',
        hotspots: [
            { top: '58%', left: '58%', width: '31%', height: '7%', target: '04_dashboard', label: 'Log In Button' },
            { top: '68%', left: '68%', width: '10%', height: '4%', target: '03_register', label: 'Sign Up Link' }
        ]
    },
    {
        id: '03_register',
        name: '03 Register Page',
        type: 'user',
        url: 'https://inpackonpack.com/register',
        hotspots: [
            { top: '74%', left: '58%', width: '31%', height: '7%', target: '02_login', label: 'Create Account Button' },
            { top: '84%', left: '68%', width: '10%', height: '4%', target: '02_login', label: 'Log In Link' }
        ]
    },
    {
        id: '04_dashboard',
        name: '04 Consumer Dashboard',
        type: 'user',
        url: 'https://inpackonpack.com/portal/dashboard',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '15%', left: '22%', width: '36%', height: '24%', target: '08_wallet', label: 'Total Points Card Link' },
            { top: '48%', left: '22%', width: '36%', height: '18%', target: '05_scan_qr', label: 'Scan Code Dashboard CTA' },
            { top: '48%', left: '60%', width: '36%', height: '18%', target: '09_rewards', label: 'Redeem Rewards Dashboard CTA' }
        ]
    },
    {
        id: '05_scan_qr',
        name: '05 Webcam Scanner',
        type: 'user',
        url: 'https://inpackonpack.com/portal/scan',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '24%', left: '24%', width: '42%', height: '53%', target: '06_scan_success', label: 'Fake Scan Hotspot (Center Webcam)' },
            { top: '46%', left: '70%', width: '26%', height: '7%', target: '04_dashboard', label: 'Cancel Scan Button' }
        ]
    },
    {
        id: '06_scan_success',
        name: '06 Verification Success',
        type: 'user',
        url: 'https://inpackonpack.com/portal/scan/success',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '78%', left: '22%', width: '22%', height: '7%', target: '07_instant_win', label: 'Instant Win Game Button' },
            { top: '78%', left: '46%', width: '22%', height: '7%', target: '04_dashboard', label: 'Return to Dashboard' }
        ]
    },
    {
        id: '07_instant_win',
        name: '07 Instant Win Game',
        type: 'user',
        url: 'https://inpackonpack.com/portal/win',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '34%', left: '22%', width: '38%', height: '33%', target: 'action:scratch', label: 'Scratch Card Overlay' },
            { top: '78%', left: '22%', width: '22%', height: '7%', target: '08_wallet', label: 'Claim Points to Wallet' },
            { top: '78%', left: '46%', width: '22%', height: '7%', target: '04_dashboard', label: 'Back to Home' }
        ]
    },
    {
        id: '08_wallet',
        name: '08 Wallet Details',
        type: 'user',
        url: 'https://inpackonpack.com/portal/wallet',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '36%', left: '22%', width: '24%', height: '7%', target: '09_rewards', label: 'Redeem Points Button' }
        ]
    },
    {
        id: '09_rewards',
        name: '09 Rewards Store',
        type: 'user',
        url: 'https://inpackonpack.com/portal/store',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '48%', left: '22%', width: '23%', height: '7%', target: '10_redeem', label: 'Claim Organic Cola (150 pts)' },
            { top: '48%', left: '47%', width: '23%', height: '7%', target: '10_redeem', label: 'Claim Discount Coupon (250 pts)' },
            { top: '48%', left: '72%', width: '23%', height: '7%', target: '10_redeem', label: 'Claim Merch Cap (500 pts)' }
        ]
    },
    {
        id: '10_redeem',
        name: '10 Redeem Checkout',
        type: 'user',
        url: 'https://inpackonpack.com/portal/store/redeem',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '74%', left: '22%', width: '20%', height: '7%', target: 'action:confirm_redeem', label: 'Redeem Confirm Trigger' }
        ]
    },
    {
        id: '11_nutrition',
        name: '11 Product Nutrition',
        type: 'user',
        url: 'https://inpackonpack.com/portal/nutrition',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '76%', left: '22%', width: '22%', height: '7%', target: '05_scan_qr', label: 'Scan New Product' }
        ]
    },
    {
        id: '12_history',
        name: '12 Account History',
        type: 'user',
        url: 'https://inpackonpack.com/portal/history',
        hotspots: [
            ...consumerSidebarHotspots
        ]
    },
    {
        id: '13_profile',
        name: '13 Consumer Profile',
        type: 'user',
        url: 'https://inpackonpack.com/portal/profile',
        hotspots: [
            ...consumerSidebarHotspots,
            { top: '15%', left: '92%', width: '4%', height: '6%', target: '20_settings', label: 'Quick Gear Settings' },
            { top: '72%', left: '22%', width: '18%', height: '7%', target: '02_login', label: 'Profile Sign Out' }
        ]
    },
    {
        id: '14_admin_dashboard',
        name: '14 Admin Portal',
        type: 'admin',
        url: 'https://inpackonpack.com/admin/dashboard',
        hotspots: [
            ...adminSidebarHotspots,
            { top: '42%', left: '22%', width: '22%', height: '14%', target: '15_product_management', label: 'Product List Card' },
            { top: '42%', left: '46%', width: '22%', height: '14%', target: '16_qr_management', label: 'QR Batch Card' },
            { top: '42%', left: '70%', width: '22%', height: '14%', target: '17_users', label: 'Users Directory Card' }
        ]
    },
    {
        id: '15_product_management',
        name: '15 Product Database',
        type: 'admin',
        url: 'https://inpackonpack.com/admin/products',
        hotspots: [
            ...adminSidebarHotspots
        ]
    },
    {
        id: '16_qr_management',
        name: '16 QR Batch Logger',
        type: 'admin',
        url: 'https://inpackonpack.com/admin/qr-batches',
        hotspots: [
            ...adminSidebarHotspots
        ]
    },
    {
        id: '17_users',
        name: '17 User Records',
        type: 'admin',
        url: 'https://inpackonpack.com/admin/users',
        hotspots: [
            ...adminSidebarHotspots
        ]
    },
    {
        id: '18_reward_rules',
        name: '18 Campaign Rules',
        type: 'admin',
        url: 'https://inpackonpack.com/admin/rules',
        hotspots: [
            ...adminSidebarHotspots,
            { top: '38%', left: '42%', width: '5%', height: '5%', target: 'action:toggle_double_pts', label: 'Toggle Promotion switch' }
        ]
    },
    {
        id: '19_reports',
        name: '19 Analytics Reports',
        type: 'admin',
        url: 'https://inpackonpack.com/admin/reports',
        hotspots: [
            ...adminSidebarHotspots
        ]
    },
    {
        id: '20_settings',
        name: '20 System Settings',
        type: 'admin',
        url: 'https://inpackonpack.com/admin/settings',
        hotspots: [
            // Contextual back
            { top: '15%', left: '1.2%', width: '16.5%', height: '5.5%', target: 'back_contextual', label: 'Settings Context Back' }
        ]
    }
];

// Screen Templates Render Function (Strict Black & White Desktop Web)
function getScreenHtml(screenId) {
    switch (screenId) {
        case '01_splash':
            return `
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <!-- Top Landing Header -->
                    <div style="height: 64px; border-bottom: 1px solid var(--wf-border-light); display: flex; justify-content: space-between; align-items: center; padding: 0 48px; background: #fff;">
                        <div style="font-size: 20px; font-weight: 800; display:flex; align-items:center; gap:8px;">
                            <div style="width:28px; height:28px; border:2px solid #000; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <div style="display: flex; gap: 32px; font-size: 14px; font-weight: 600; color: var(--wf-text-muted);">
                            <span>Product Verification</span>
                            <span>Consumer Incentives</span>
                            <span>Rules Engine</span>
                            <span class="wf-link-btn" style="color:#000;">Access Web Portal</span>
                        </div>
                    </div>

                    <!-- Split Landing Hero Banner -->
                    <div class="wf-split-layout" style="flex: 1;">
                        <div class="wf-split-left">
                            <div class="wf-image-box" style="height: 320px; max-width: 480px; margin-bottom: 24px;">
                                <span>Hero Graphic Vector Illustration Placeholder</span>
                            </div>
                            <p class="text-sm text-gray-500">Scan QR codes on packaging interiors to unlock instant verified utility</p>
                        </div>
                        <div class="wf-split-right">
                            <span class="text-xs bold text-gray-500" style="text-transform: uppercase; letter-spacing: 1px;">Smart Brand Loyalty System</span>
                            <h1 class="wf-title" style="font-size: 38px; margin: 12px 0 20px 0; line-height: 1.2;">Engage, Verify, and Earn Vouchers Instantly</h1>
                            <p class="wf-subtitle" style="font-size: 16px; max-width: 480px;">
                                Welcome to InPackOnPack. Easily scan secure codes inside brand packaging to verify authenticity, view sustainable product lifecycles, and claim instant loyalty rewards.
                            </p>
                            <div class="mt-4">
                                <button class="wf-btn wf-btn-primary" style="padding: 14px 28px; font-size: 15px;">Launch Portal & Get Started</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '02_login':
            return `
                <div class="wf-split-layout">
                    <div class="wf-split-left" style="padding: 80px;">
                        <div class="wf-logo-box" style="width: 80px; height: 80px; font-size: 32px; border-radius: 16px;"><span>IOP</span></div>
                        <h2 class="wf-title" style="margin-top: 24px;">InPackOnPack Portal</h2>
                        <p class="wf-subtitle" style="max-width: 360px; margin-top: 10px;">The smart solution for consumer activation, item authentication, and carbon offsets logging.</p>
                    </div>
                    <div class="wf-split-right">
                        <div class="wf-form-container">
                            <h2 class="wf-title">Welcome Back</h2>
                            <p class="wf-subtitle">Access your loyalty ledger profile</p>

                            <div class="wf-input-group mb-2">
                                <span class="wf-input-label">Corporate or Consumer Email</span>
                                <input type="text" class="wf-input" placeholder="alex@example.com" value="alex@example.com" disabled>
                            </div>

                            <div class="wf-input-group mt-2">
                                <div class="flex justify-between w-full">
                                    <span class="wf-input-label">Secure Access Password</span>
                                    <span class="text-xs text-muted" style="text-decoration: underline; cursor:pointer;">Forgot?</span>
                                </div>
                                <input type="password" class="wf-input" placeholder="••••••••" value="password123" disabled>
                            </div>

                            <div class="wf-checkbox-group mt-2 mb-2">
                                <div class="wf-checkbox checked"></div>
                                <span class="text-sm">Enforce single sign-on on this desktop</span>
                            </div>

                            <button class="wf-btn wf-btn-primary w-full mt-2">Sign In to Dashboard</button>
                            
                            <div class="text-center mt-4">
                                <span class="text-sm text-gray-500">Need to create an account?</span>
                                <span class="wf-link-btn">Register here</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '03_register':
            return `
                <div class="wf-split-layout">
                    <div class="wf-split-left" style="padding: 80px;">
                        <div class="wf-logo-box" style="width: 80px; height: 80px; font-size: 32px; border-radius: 16px;"><span>IOP</span></div>
                        <h2 class="wf-title" style="margin-top: 24px;">Consumer Registration</h2>
                        <p class="wf-subtitle" style="max-width: 360px; margin-top: 10px;">Claim bonus points for creating your decentralized profile network.</p>
                    </div>
                    <div class="wf-split-right">
                        <div class="wf-form-container" style="max-width: 480px;">
                            <h2 class="wf-title">Create Consumer Account</h2>
                            <p class="wf-subtitle">Input your particulars below</p>

                            <div class="wf-input-group">
                                <span class="wf-input-label">Full Profile Name</span>
                                <input type="text" class="wf-input" placeholder="Alex Smith" disabled>
                            </div>

                            <div class="wf-input-group mt-2">
                                <span class="wf-input-label">Verify Email Address</span>
                                <input type="text" class="wf-input" placeholder="alex@example.com" disabled>
                            </div>

                            <div class="wf-input-group mt-2">
                                <span class="wf-input-label">Choose Strong Password</span>
                                <input type="password" class="wf-input" placeholder="••••••••" disabled>
                            </div>

                            <div class="wf-checkbox-group mt-2 mb-2">
                                <div class="wf-checkbox checked"></div>
                                <span class="text-xs">I consent to the terms of database loyalty storage.</span>
                            </div>

                            <button class="wf-btn wf-btn-primary w-full mt-2">Create Account</button>
                            
                            <div class="text-center mt-4">
                                <span class="text-sm text-gray-500">Already registered?</span>
                                <span class="wf-link-btn">Log In</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '04_dashboard':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item active">🏠 Dashboard</li>
                            <li class="wf-web-nav-item">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Consumer Web Portal</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <!-- Stats Decks -->
                            <div class="wf-deck-grid">
                                <div class="wf-card dark" style="cursor:pointer;">
                                    <span class="wf-card-label">AVAILABLE BALANCE</span>
                                    <div class="wf-card-value">350 PTS</div>
                                    <span class="text-xs opacity-75">Click to view wallet ledgers →</span>
                                </div>
                                <div class="wf-card">
                                    <span class="wf-card-label">VERIFIED SCANS</span>
                                    <div class="wf-card-value">12 codes</div>
                                    <span class="text-xs text-muted">+2 scanned today</span>
                                </div>
                                <div class="wf-card">
                                    <span class="wf-card-label">CARBON SAVINGS</span>
                                    <div class="wf-card-value">4.8 kg CO₂</div>
                                    <span class="text-xs text-muted">100% recyclables logged</span>
                                </div>
                                <div class="wf-card">
                                    <span class="wf-card-label">REWARDS CLAIMED</span>
                                    <div class="wf-card-value">3 Vouchers</div>
                                    <span class="text-xs text-muted">Last redeemed 1 day ago</span>
                                </div>
                            </div>

                            <div class="wf-col-grid-2">
                                <!-- Main Panel -->
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card" style="padding:40px; text-align:center; border: 2px dashed var(--wf-border-light);">
                                        <h3 class="text-lg bold mb-2">Claim rewards inside your packaging</h3>
                                        <p class="text-sm text-gray-500 mb-4" style="max-width: 500px; margin: 0 auto 16px auto;">
                                            Use your web camera device to scan securely printed codes on product interiors. Instantly unlock cashback coupons and verify nutritional properties.
                                        </p>
                                        <div>
                                            <button class="wf-btn wf-btn-primary">Activate Web Camera Scanner</button>
                                        </div>
                                    </div>

                                    <span class="wf-section-title">Latest Scan Events</span>
                                    <div class="wf-table-container">
                                        <table class="wf-table">
                                            <thead>
                                                <tr><th>Product SKU</th><th>Batch Serial</th><th>Points awarded</th><th>Status</th></tr>
                                            </thead>
                                            <tbody>
                                                <tr><td>Organic Orange Juice 1L</td><td>#QR-9902A-88</td><td>+50 PTS</td><td>Verified</td></tr>
                                                <tr><td>Zero Sugar Soda 330ml Can</td><td>#QR-8871K-09</td><td>+50 PTS</td><td>Verified</td></tr>
                                                <tr><td>Whole wheat cereal box 500g</td><td>#QR-5541L-12</td><td>+50 PTS</td><td>Verified</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Side panel -->
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card">
                                        <span class="wf-section-title">Current Campaigns</span>
                                        <div class="wf-image-box" style="height:120px;">
                                            <span>Summer Promo double points banner</span>
                                        </div>
                                        <p class="text-xs text-gray-500">Scan any product from the Organic Cola line and receive double point incentives on your account.</p>
                                        <button class="wf-btn wf-btn-secondary" style="width:100%;">View Rewards Store</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '05_scan_qr':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item active">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Webcam Code Scanner</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="wf-col-grid-2">
                                <div>
                                    <span class="wf-section-title">Camera Feed Viewport</span>
                                    <div class="wf-webcam-feed mt-2">
                                        <div class="wf-webcam-target"></div>
                                        <p style="position:absolute; bottom:16px; color:#fff; font-size:12px; opacity:0.8; width:100%; text-align:center;">
                                            (Click webcam container to simulate scan verification success)
                                        </p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card">
                                        <span class="wf-section-title">Instructions</span>
                                        <ul style="font-size: 13px; color: var(--wf-text-muted); margin-left: 16px; display:flex; flex-direction:column; gap:8px;">
                                            <li>Place the printed QR code within packaging interior bounds in front of laptop camera lens.</li>
                                            <li>Ensure the workspace area is properly illuminated.</li>
                                            <li>Do not bend or crumple the code card during verification.</li>
                                        </ul>
                                    </div>
                                    <div class="wf-card">
                                        <span class="wf-section-title">Manual Code Input</span>
                                        <p class="text-xs text-gray-500 mb-2">If webcam is unavailable, type the security hash below.</p>
                                        <input type="text" class="wf-input" placeholder="e.g. #QR-9902A-88" disabled>
                                        <button class="wf-btn wf-btn-secondary mt-2 w-full">Verify Code</button>
                                    </div>
                                    <button class="wf-btn wf-btn-secondary" style="width:100%;">Cancel and Return</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '06_scan_success':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item active">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Verification Output</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content wf-center-content" style="min-height:500px; max-width:600px; margin: 0 auto; gap:20px;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--wf-border-dark); display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 8px;">
                                ✓
                            </div>
                            <h2 class="wf-title">Code Verification Successful</h2>
                            <p class="wf-subtitle text-center">Product credentials confirmed securely. Points added to ledgers.</p>
                            
                            <div class="wf-card w-full text-left" style="background:#fff;">
                                <span class="wf-card-label">AUTHENTICATION LOGS</span>
                                <div class="text-sm mt-2"><strong>Product SKU:</strong> Organic Cola Widescreen 500ml Can</div>
                                <div class="text-sm mt-1"><strong>Batch ID:</strong> #QR-99211-OP90</div>
                                <div class="text-sm mt-1"><strong>Carbon Grade:</strong> 100% Recyclable Aluminum (Grade A)</div>
                            </div>

                            <div class="wf-card dark w-full text-center">
                                <span class="wf-card-label">REWARDS LEDGER</span>
                                <div class="wf-card-value">+50 LOYALTY PTS</div>
                            </div>

                            <div class="flex gap-4 w-full">
                                <button class="wf-btn wf-btn-primary" style="flex:1;">Claim Widescreen Instant Win Game</button>
                                <button class="wf-btn wf-btn-secondary" style="flex:1;">Go back to Dashboard</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '07_instant_win':
            const winState = screenStates['07_instant_win'];
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item active">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Instant Win Game</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content" style="max-width:900px; margin: 0 auto; width:100%;">
                            <h2 class="wf-title text-center">Widescreen Scratch Card</h2>
                            <p class="wf-subtitle text-center">Use mouse clicks or hold/drag on scratch card area to reveal instant promotional prizes!</p>

                            <div class="wf-scratch-panel mt-4">
                                <div class="wf-scratch-card ${winState.revealed ? 'revealed' : ''}">
                                    <div class="wf-scratch-overlay">
                                        <span style="font-size: 36px; margin-bottom: 8px;">🎁</span>
                                        <span style="font-weight: 700; font-size: 15px;">CLICK AREA TO SCRATCH REVEAL</span>
                                    </div>
                                    <div class="wf-scratch-prize text-center">
                                        <span class="text-xs text-muted">INSTANT WIN BONUS</span>
                                        <div class="prize-val">+100 PTS</div>
                                        <span class="text-sm bold">Plus: Widescreen Beverage Coupon V-991</span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card">
                                        <span class="wf-section-title">Prize Ledger Terms</span>
                                        <p class="text-xs text-gray-500">
                                            Bonus points will post immediately to consumer records. The beverage coupon can be exchanged within the Rewards Store panel or redeemed directly at partner checkouts.
                                        </p>
                                    </div>
                                    <button class="wf-btn wf-btn-primary" ${!winState.revealed ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                                        Claim Rewards & View Wallet
                                    </button>
                                    <button class="wf-btn wf-btn-secondary">Skip and Return to Home</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '08_wallet':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item active">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Loyalty Ledger Wallet</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="wf-col-grid-2">
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card dark" style="padding: 32px;">
                                        <span class="wf-card-label">SECURED GOLD TIER CONSUMER ACCOUNT</span>
                                        <div class="wf-card-value" style="font-size: 40px; margin-top: 12px;">500 LOYALTY POINTS</div>
                                        <p class="text-xs opacity-75 mt-2">Active balance. 150 points expire on Dec 31, 2026.</p>
                                    </div>

                                    <span class="wf-section-title">Transactions Ledger</span>
                                    <div class="wf-table-container">
                                        <table class="wf-table">
                                            <thead>
                                                <tr><th>Date</th><th>Description</th><th>Type</th><th>Delta</th></tr>
                                            </thead>
                                            <tbody>
                                                <tr><td>July 28, 2026</td><td>Instant Win Scratch Bonus</td><td>Promotional Credit</td><td style="font-weight:bold;">+100 PTS</td></tr>
                                                <tr><td>July 28, 2026</td><td>Organic Cola verification scan</td><td>Scanning Log</td><td style="font-weight:bold;">+50 PTS</td></tr>
                                                <tr><td>July 24, 2026</td><td>Account activation credit</td><td>SSO registration</td><td style="font-weight:bold;">+350 PTS</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="flex flex-col gap-4">
                                    <div class="wf-card text-center" style="border: 2px solid var(--wf-border-dark);">
                                        <span class="wf-section-title">Barcode for Retail Scan</span>
                                        <div class="flex justify-between items-stretch" style="height: 80px; padding: 0 20px; margin: 20px 0;">
                                            <div style="width: 6px; background: #000;"></div>
                                            <div style="width: 2px; background: #000;"></div>
                                            <div style="width: 8px; background: #000;"></div>
                                            <div style="width: 1px; background: #000;"></div>
                                            <div style="width: 6px; background: #000;"></div>
                                            <div style="width: 4px; background: #000;"></div>
                                            <div style="width: 2px; background: #000;"></div>
                                            <div style="width: 8px; background: #000;"></div>
                                            <div style="width: 3px; background: #000;"></div>
                                            <div style="width: 5px; background: #000;"></div>
                                            <div style="width: 2px; background: #000;"></div>
                                            <div style="width: 6px; background: #000;"></div>
                                        </div>
                                        <span class="text-xs font-mono">ID: 4882-9901-IOP</span>
                                    </div>
                                    <button class="wf-btn wf-btn-primary" style="width:100%;">Redeem Vouchers</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '09_rewards':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item active">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Rewards Catalog</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="wf-tabs">
                                <div class="wf-tab active">All Rewards</div>
                                <div class="wf-tab">Organic Drinks</div>
                                <div class="wf-tab">E-Commerce Coupons</div>
                                <div class="wf-tab">Brand Merchandise</div>
                            </div>

                            <div class="wf-col-grid-3">
                                <div class="wf-card">
                                    <div class="wf-image-box" style="height:120px;"><span>C</span></div>
                                    <h3 class="text-sm bold mt-2">Free Organic Cola Can</h3>
                                    <p class="text-xs text-gray-500">Claim 500ml can at partner checkouts.</p>
                                    <div class="flex justify-between items-center mt-2">
                                        <span class="text-sm bold">150 POINTS</span>
                                        <button class="wf-btn wf-btn-primary" style="padding:6px 12px; font-size:12px;">Claim Item</button>
                                    </div>
                                </div>

                                <div class="wf-card">
                                    <div class="wf-image-box" style="height:120px;"><span>$</span></div>
                                    <h3 class="text-sm bold mt-2">$5 Grocery Discount</h3>
                                    <p class="text-xs text-gray-500">Universal grocery voucher checkout token.</p>
                                    <div class="flex justify-between items-center mt-2">
                                        <span class="text-sm bold">250 POINTS</span>
                                        <button class="wf-btn wf-btn-primary" style="padding:6px 12px; font-size:12px;">Claim Item</button>
                                    </div>
                                </div>

                                <div class="wf-card">
                                    <div class="wf-image-box" style="height:120px;"><span>H</span></div>
                                    <h3 class="text-sm bold mt-2">InPack Brand Trucker Cap</h3>
                                    <p class="text-xs text-gray-500">Free shipping to user address.</p>
                                    <div class="flex justify-between items-center mt-2">
                                        <span class="text-sm bold">500 POINTS</span>
                                        <button class="wf-btn wf-btn-primary" style="padding:6px 12px; font-size:12px;">Claim Item</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '10_redeem':
            const redeemState = screenStates['10_redeem'];
            if (redeemState.step === 'detail') {
                return `
                    <div class="wf-web-shell">
                        <!-- Left Sidebar Nav -->
                        <div class="wf-web-sidebar">
                            <div class="wf-web-logo">
                                <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                                <span>InPackOnPack</span>
                            </div>
                            <ul class="wf-web-nav">
                                <li class="wf-web-nav-item">🏠 Dashboard</li>
                                <li class="wf-web-nav-item">📷 Web Scan QR</li>
                                <li class="wf-web-nav-item">💳 My Wallet</li>
                                <li class="wf-web-nav-item active">🎁 Rewards Store</li>
                                <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                                <li class="wf-web-nav-item">🕒 Activity History</li>
                                <li class="wf-web-nav-item">👤 Profile settings</li>
                                <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                                <li class="wf-web-nav-item">🛠️ Preferences</li>
                            </ul>
                        </div>

                        <!-- Main Portal Layout -->
                        <div class="wf-web-main">
                            <div class="wf-web-header">
                                <h2 class="wf-section-title" style="margin-bottom:0;">Claim checkout</h2>
                                <div class="flex items-center gap-2">
                                    <div class="wf-item-avatar">AS</div>
                                    <div class="text-sm bold">Alex Smith</div>
                                </div>
                            </div>
                            
                            <div class="wf-web-content" style="max-width:900px; margin: 0 auto; width:100%;">
                                <div class="wf-col-grid-2">
                                    <div class="flex flex-col gap-4">
                                        <div class="wf-image-box" style="height:280px;"><span>Voucher Graphic Placeholder</span></div>
                                        <h2 class="wf-title" style="font-size:22px;">Free Organic Cola 500ml Can</h2>
                                        <p class="text-sm text-gray-500">Exchanged digitally against active user loyalty balances. Scan is required at partner POS counters to log item redemption.</p>
                                    </div>
                                    <div class="flex flex-col gap-4">
                                        <div class="wf-card">
                                            <span class="wf-section-title">Points Calculator</span>
                                            <div class="flex justify-between mt-2" style="font-size:13px;">
                                                <span>Active Wallet Points</span>
                                                <span>500 PTS</span>
                                            </div>
                                            <div class="flex justify-between mt-2 pt-2" style="font-size:13px; border-top: 1px solid var(--wf-border-light);">
                                                <span>Claim Voucher Cost</span>
                                                <span>-150 PTS</span>
                                            </div>
                                            <div class="flex justify-between mt-2 pt-2" style="font-size:14px; font-weight:bold; border-top: 1px solid var(--wf-border-light);">
                                                <span>New balance</span>
                                                <span>350 PTS</span>
                                            </div>
                                        </div>
                                        <button class="wf-btn wf-btn-primary" style="width:100%;">Redeem Reward Voucher</button>
                                        <button class="wf-btn wf-btn-secondary" style="width:100%;">Cancel and Return</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (redeemState.step === 'confirming') {
                return `
                    <div class="wf-web-shell" style="position:relative;">
                        <div class="wf-web-sidebar" style="opacity:0.3; pointer-events:none;"><div class="wf-web-logo"><span>InPackOnPack</span></div></div>
                        <div class="wf-web-main" style="opacity:0.3; pointer-events:none;">
                            <div class="wf-web-header"><h2>Claim checkout</h2></div>
                            <div class="wf-web-content">Confirm exchange cola...</div>
                        </div>

                        <!-- Confirmation modal dialog -->
                        <div class="wf-frame-modal">
                            <div class="wf-modal-box text-center">
                                <span style="font-size:40px;">⚠️</span>
                                <h3 class="wf-section-title mt-2">Deduct points from wallet?</h3>
                                <p class="text-xs text-muted">Confirm exchange of 150 loyalty points. This transaction cannot be undone on the ledger.</p>
                                <div class="flex gap-4 w-full mt-4">
                                    <button class="wf-btn wf-btn-secondary" style="flex:1;" onclick="cancelRedeemStep()">Cancel</button>
                                    <button class="wf-btn wf-btn-primary" style="flex:1;" onclick="completeRedeemStep()">Confirm Deduction</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="wf-web-shell">
                        <!-- Left Sidebar Nav -->
                        <div class="wf-web-sidebar">
                            <div class="wf-web-logo">
                                <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                                <span>InPackOnPack</span>
                            </div>
                            <ul class="wf-web-nav">
                                <li class="wf-web-nav-item">🏠 Dashboard</li>
                                <li class="wf-web-nav-item">📷 Web Scan QR</li>
                                <li class="wf-web-nav-item">💳 My Wallet</li>
                                <li class="wf-web-nav-item active">🎁 Rewards Store</li>
                                <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                                <li class="wf-web-nav-item">🕒 Activity History</li>
                                <li class="wf-web-nav-item">👤 Profile settings</li>
                                <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                                <li class="wf-web-nav-item">🛠️ Preferences</li>
                            </ul>
                        </div>

                        <!-- Main Portal Layout -->
                        <div class="wf-web-main">
                            <div class="wf-web-header">
                                <h2 class="wf-section-title" style="margin-bottom:0;">Claim checkout</h2>
                                <div class="flex items-center gap-2">
                                    <div class="wf-item-avatar">AS</div>
                                    <div class="text-sm bold">Alex Smith</div>
                                </div>
                            </div>
                            
                            <div class="wf-web-content wf-center-content" style="min-height:500px; max-width:600px; margin: 0 auto; gap:16px;">
                                <div style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid var(--wf-border-dark); display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 8px;">
                                    ✓
                                </div>
                                <h2 class="wf-title">Redemption Successful</h2>
                                <p class="wf-subtitle text-center">Your voucher token is active. Present checkout receipt details below to partner store cashiers.</p>

                                <div class="wf-qr-container">
                                    <div class="wf-qr-block solid"></div>
                                    <div class="wf-qr-block"></div>
                                    <div class="wf-qr-block solid"></div>
                                    <div class="wf-qr-block solid"></div>
                                    <div class="wf-qr-block solid"></div>
                                    <div class="wf-qr-block"></div>
                                    <div class="wf-qr-block"></div>
                                    <div class="wf-qr-block solid"></div>
                                    <div class="wf-qr-block solid"></div>
                                </div>

                                <span class="text-sm font-mono bold" style="background:var(--wf-bg-card); padding: 8px 16px; border-radius:4px;">CODE: W-COL-150-CLAIM</span>
                                
                                <div class="w-full mt-4">
                                    <button class="wf-btn wf-btn-primary w-full">Done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
        case '11_nutrition':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item active">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Eco & Nutrition Database</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="wf-col-grid-2">
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card">
                                        <div class="flex justify-between items-center">
                                            <h3 class="wf-section-title">Nutrition Label: Organic Cola 500ml</h3>
                                            <span class="text-xs border-dashed" style="padding: 2px 8px; border: 1px dashed; border-radius:4px;">Blockchain Verified</span>
                                        </div>
                                        <div class="wf-table-container mt-2">
                                            <table class="wf-table">
                                                <thead>
                                                    <tr><th>Nutrient</th><th>Per serving</th><th>% Daily Guideline</th></tr>
                                                </thead>
                                                <tbody>
                                                    <tr><td>Total Energy</td><td>140 kcal</td><td>7%</td></tr>
                                                    <tr><td>Carbohydrates / Sugars</td><td>35g</td><td>39%</td></tr>
                                                    <tr><td>Sodium / Salts</td><td>45mg</td><td>2%</td></tr>
                                                    <tr><td>Dietary fibers</td><td>0g</td><td>0%</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p class="text-xs text-gray-500 mt-1">Ingredients: Carbonated Water, Organic Cane Sugar, Citric Acid, Natural Cola Flavors.</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card" style="border-left: 4px solid var(--wf-border-dark);">
                                        <span class="wf-section-title">Carbon Index Lifecycle</span>
                                        <div class="wf-card-value" style="font-size:24px;">Grade A Sustainability Rating</div>
                                        <p class="text-xs text-gray-500">Aluminum can is made of 100% post-consumer materials. Double carbon savings points available by recycling package at designated depositories.</p>
                                    </div>
                                    <button class="wf-btn wf-btn-primary">Scan Another Product</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '12_history':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item active">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Activity History Log</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="wf-tabs">
                                <div class="wf-tab active">All Event logs</div>
                                <div class="wf-tab">Verification Scans</div>
                                <div class="wf-tab">Redemption Claims</div>
                            </div>
                            
                            <div class="wf-table-container">
                                <table class="wf-table">
                                    <thead>
                                        <tr><th>Timestamp</th><th>Transaction Details</th><th>Reference Type</th><th>Balance Change</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>July 28, 2026 14:22</td><td>Redeemed: Free Cola Voucher</td><td>Coupon Claim</td><td style="color:#ef4444; font-weight:bold;">-150 PTS</td></tr>
                                        <tr><td>July 28, 2026 11:05</td><td>Instant Win bonus credited</td><td>Promotional Credit</td><td style="color:#10b981; font-weight:bold;">+100 PTS</td></tr>
                                        <tr><td>July 28, 2026 11:04</td><td>Verified scan: Organic Cola</td><td>Product QR scan</td><td style="color:#10b981; font-weight:bold;">+50 PTS</td></tr>
                                        <tr><td>July 27, 2026 09:12</td><td>Verified scan: Diet Soda 330ml Can</td><td>Product QR scan</td><td style="color:#10b981; font-weight:bold;">+50 PTS</td></tr>
                                        <tr><td>July 24, 2026 10:00</td><td>Account SSO Sign up reward</td><td>SSO Sign up</td><td style="color:#10b981; font-weight:bold;">+350 PTS</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '13_profile':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item active">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">Consumer Profile Ledger</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar">AS</div>
                                <div class="text-sm bold">Alex Smith</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="wf-col-grid-2">
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card">
                                        <h3 class="wf-section-title">Personal Particulars</h3>
                                        <div class="wf-input-group mt-2">
                                            <span class="wf-input-label">Display Profile Name</span>
                                            <input type="text" class="wf-input" value="Alex Smith" disabled>
                                        </div>
                                        <div class="wf-input-group mt-2">
                                            <span class="wf-input-label">Verified Email Link</span>
                                            <input type="text" class="wf-input" value="alex@example.com" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card text-center" style="align-items:center;">
                                        <div class="wf-item-avatar" style="width:80px; height:80px; font-size:32px;">AS</div>
                                        <h3 class="text-sm bold mt-2">Alex Smith</h3>
                                        <span class="text-xs border-dashed" style="padding: 2px 10px; border-radius:12px;">GOLD LEVEL CONSUMER</span>
                                        <div class="w-full flex justify-between mt-4 pt-4" style="border-top:1px solid var(--wf-border-light); font-size:12px;">
                                            <span>Member since:</span>
                                            <span class="bold">July 2026</span>
                                        </div>
                                    </div>
                                    <button class="wf-btn wf-btn-secondary">Log Out of Ledger</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '14_admin_dashboard':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar" style="background:#111827; border-right: 1px solid #374151;">
                        <div class="wf-web-logo" style="color:#fff;">
                            <div style="width:24px; height:24px; border:2px solid #fff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item active" style="background:#1f2937; color:#fff;">📊 Admin Dashboard</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📦 Product Database</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚡ QR Batches</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">👥 Users Directory</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">🛠️ Rules Editor</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📈 Export Analytics</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid #374151; padding-top:16px; color:#9ca3af;">🏠 Consumer Portal</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚙️ System Settings</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main" style="background:#111827; color:#fff;">
                        <div class="wf-web-header" style="background:#1f2937; border-bottom: 1px solid #374151;">
                            <h2 class="wf-section-title" style="margin-bottom:0; color:#fff;">Admin Control Panel</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar" style="background:#111827; border-color:#374151; color:#fff;">AD</div>
                                <div class="text-sm bold">System Admin</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <!-- Stats Decks -->
                            <div class="wf-deck-grid">
                                <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff;">
                                    <span class="text-xs text-gray-400">TOTAL QR SCANS</span>
                                    <div class="wf-card-value">14,822</div>
                                    <span class="text-xs text-gray-500">Across 14 active products</span>
                                </div>
                                <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff;">
                                    <span class="text-xs text-gray-400">REGISTERED USERS</span>
                                    <div class="wf-card-value">3,219</div>
                                    <span class="text-xs text-gray-500">+12 signed up today</span>
                                </div>
                                <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff;">
                                    <span class="text-xs text-gray-400">GENERATED QR CODES</span>
                                    <div class="wf-card-value">120,000</div>
                                    <span class="text-xs text-gray-500">24 active print batches</span>
                                </div>
                                <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff;">
                                    <span class="text-xs text-gray-400">REDEEM RATE</span>
                                    <div class="wf-card-value">84.2%</div>
                                    <span class="text-xs text-gray-500">Industry benchmark: 60%</span>
                                </div>
                            </div>

                            <div class="wf-col-grid-2">
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff;">
                                        <span class="text-xs text-gray-400">SCAN VELOCITY INDEX (LAST 7 DAYS)</span>
                                        <div class="wf-chart-container" style="background:none; border:none; height:180px;">
                                            <div class="wf-chart-bar" style="height:35%; background:#4b5563;"><span>310</span></div>
                                            <div class="wf-chart-bar" style="height:48%; background:#4b5563;"><span>420</span></div>
                                            <div class="wf-chart-bar" style="height:62%; background:#4b5563;"><span>580</span></div>
                                            <div class="wf-chart-bar" style="height:55%; background:#4b5563;"><span>510</span></div>
                                            <div class="wf-chart-bar" style="height:80%; background:#9ca3af;"><span>720</span></div>
                                            <div class="wf-chart-bar" style="height:72%; background:#9ca3af;"><span>680</span></div>
                                            <div class="wf-chart-bar" style="height:95%; background:#fff;"><span>940</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4">
                                    <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff;">
                                        <span class="text-xs text-gray-400">Quick Shortcuts</span>
                                        <button class="wf-btn wf-btn-secondary w-full text-left" style="background:#111827; border-color:#374151; color:#fff;">📦 Product Database</button>
                                        <button class="wf-btn wf-btn-secondary w-full text-left" style="background:#111827; border-color:#374151; color:#fff;">⚡ Generate QR Code Batch</button>
                                        <button class="wf-btn wf-btn-secondary w-full text-left" style="background:#111827; border-color:#374151; color:#fff;">🛠️ Campaign Rules Panel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '15_product_management':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar" style="background:#111827; border-right: 1px solid #374151;">
                        <div class="wf-web-logo" style="color:#fff;">
                            <div style="width:24px; height:24px; border:2px solid #fff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📊 Admin Dashboard</li>
                            <li class="wf-web-nav-item active" style="background:#1f2937; color:#fff;">📦 Product Database</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚡ QR Batches</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">👥 Users Directory</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">🛠️ Rules Editor</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📈 Export Analytics</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid #374151; padding-top:16px; color:#9ca3af;">🏠 Consumer Portal</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚙️ System Settings</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main" style="background:#111827; color:#fff;">
                        <div class="wf-web-header" style="background:#1f2937; border-bottom: 1px solid #374151;">
                            <h2 class="wf-section-title" style="margin-bottom:0; color:#fff;">Product Catalog Database</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar" style="background:#111827; border-color:#374151; color:#fff;">AD</div>
                                <div class="text-sm bold">System Admin</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="flex justify-between items-center">
                                <div class="wf-input-group" style="max-width:300px;">
                                    <input type="text" class="wf-input" placeholder="🔍 Search product SKU..." style="background:#1f2937; border-color:#374151; color:#fff;" disabled>
                                </div>
                                <button class="wf-btn wf-btn-primary" style="background:#fff; color:#000; border:none;">+ Create New Product</button>
                            </div>

                            <div class="wf-table-container" style="border-color:#374151;">
                                <table class="wf-table">
                                    <thead>
                                        <tr style="background:#1f2937;"><th style="border-color:#374151; color:#fff;">SKU Identifier</th><th style="border-color:#374151; color:#fff;">Product Name</th><th style="border-color:#374151; color:#fff;">Active Campaign</th><th style="border-color:#374151; color:#fff;">Status</th><th style="border-color:#374151; color:#fff;">Action</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">IOP-PROD-01</td><td style="border-color:#374151;">Organic Cola 500ml Can</td><td style="border-color:#374151;">Summer Double Points promotion</td><td style="border-color:#374151;"><span style="color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px;">Active</span></td><td style="border-color:#374151; text-decoration:underline; cursor:pointer;">Edit Artboard</td></tr>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">IOP-PROD-02</td><td style="border-color:#374151;">Organic Orange Juice 1L</td><td style="border-color:#374151;">Eco Sustainability deposit recycling</td><td style="border-color:#374151;"><span style="color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px;">Active</span></td><td style="border-color:#374151; text-decoration:underline; cursor:pointer;">Edit Artboard</td></tr>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">IOP-PROD-03</td><td style="border-color:#374151;">Diet Soda 330ml Can</td><td style="border-color:#374151;">None</td><td style="border-color:#374151;"><span style="color:#9ca3af; border:1px solid #9ca3af; padding:2px 8px; border-radius:4px;">Draft</span></td><td style="border-color:#374151; text-decoration:underline; cursor:pointer;">Edit Artboard</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '16_qr_management':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar" style="background:#111827; border-right: 1px solid #374151;">
                        <div class="wf-web-logo" style="color:#fff;">
                            <div style="width:24px; height:24px; border:2px solid #fff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📊 Admin Dashboard</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📦 Product Database</li>
                            <li class="wf-web-nav-item active" style="background:#1f2937; color:#fff;">⚡ QR Batches</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">👥 Users Directory</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">🛠️ Rules Editor</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📈 Export Analytics</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid #374151; padding-top:16px; color:#9ca3af;">🏠 Consumer Portal</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚙️ System Settings</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main" style="background:#111827; color:#fff;">
                        <div class="wf-web-header" style="background:#1f2937; border-bottom: 1px solid #374151;">
                            <h2 class="wf-section-title" style="margin-bottom:0; color:#fff;">QR Generation System</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar" style="background:#111827; border-color:#374151; color:#fff;">AD</div>
                                <div class="text-sm bold">System Admin</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="flex justify-between items-center">
                                <h3 class="wf-section-title" style="color:#fff;">QR Code Batches</h3>
                                <button class="wf-btn wf-btn-primary" style="background:#fff; color:#000; border:none;">⚡ Generate New Batch</button>
                            </div>

                            <div class="wf-table-container" style="border-color:#374151;">
                                <table class="wf-table">
                                    <thead>
                                        <tr style="background:#1f2937;"><th style="border-color:#374151; color:#fff;">Batch ID</th><th style="border-color:#374151; color:#fff;">Associated SKU</th><th style="border-color:#374151; color:#fff;">Quantity</th><th style="border-color:#374151; color:#fff;">Scans logged</th><th style="border-color:#374151; color:#fff;">Status</th><th style="border-color:#374151; color:#fff;">Export files</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">BATCH-2026-A</td><td style="border-color:#374151;">Organic Cola 500ml Can</td><td style="border-color:#374151;">5,000</td><td style="border-color:#374151;">3,120</td><td style="border-color:#374151;"><span style="color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px;">Active</span></td><td style="border-color:#374151; text-decoration:underline; cursor:pointer;">Download CSV</td></tr>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">BATCH-2026-B</td><td style="border-color:#374151;">Organic Orange Juice 1L</td><td style="border-color:#374151;">10,000</td><td style="border-color:#374151;">890</td><td style="border-color:#374151;"><span style="color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px;">Active</span></td><td style="border-color:#374151; text-decoration:underline; cursor:pointer;">Download CSV</td></tr>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">BATCH-2026-C</td><td style="border-color:#374151;">Diet Soda 330ml Can</td><td style="border-color:#374151;">5,000</td><td style="border-color:#374151;">0</td><td style="border-color:#374151;"><span style="color:#9ca3af; border:1px solid #9ca3af; padding:2px 8px; border-radius:4px;">Inactive</span></td><td style="border-color:#374151; opacity:0.5;">No Scans</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '17_users':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar" style="background:#111827; border-right: 1px solid #374151;">
                        <div class="wf-web-logo" style="color:#fff;">
                            <div style="width:24px; height:24px; border:2px solid #fff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📊 Admin Dashboard</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📦 Product Database</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚡ QR Batches</li>
                            <li class="wf-web-nav-item active" style="background:#1f2937; color:#fff;">👥 Users Directory</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">🛠️ Rules Editor</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📈 Export Analytics</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid #374151; padding-top:16px; color:#9ca3af;">🏠 Consumer Portal</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚙️ System Settings</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main" style="background:#111827; color:#fff;">
                        <div class="wf-web-header" style="background:#1f2937; border-bottom: 1px solid #374151;">
                            <h2 class="wf-section-title" style="margin-bottom:0; color:#fff;">Registered Users Directory</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar" style="background:#111827; border-color:#374151; color:#fff;">AD</div>
                                <div class="text-sm bold">System Admin</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content">
                            <div class="wf-input-group" style="max-width:320px;">
                                <input type="text" class="wf-input" placeholder="🔍 Search by user name or email..." style="background:#1f2937; border-color:#374151; color:#fff;" disabled>
                            </div>

                            <div class="wf-table-container" style="border-color:#374151;">
                                <table class="wf-table">
                                    <thead>
                                        <tr style="background:#1f2937;"><th style="border-color:#374151; color:#fff;">Consumer Name</th><th style="border-color:#374151; color:#fff;">Email Address</th><th style="border-color:#374151; color:#fff;">Role</th><th style="border-color:#374151; color:#fff;">Loyalty balance</th><th style="border-color:#374151; color:#fff;">Verifications</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">Alex Smith</td><td style="border-color:#374151;">alex@example.com</td><td style="border-color:#374151;">Consumer</td><td style="border-color:#374151;">350 PTS</td><td style="border-color:#374151;">12 scans</td></tr>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">Jane Doe</td><td style="border-color:#374151;">jane@example.com</td><td style="border-color:#374151;">Admin</td><td style="border-color:#374151;">0 PTS</td><td style="border-color:#374151;">0 scans</td></tr>
                                        <tr style="background:#111827; color:#fff;"><td style="border-color:#374151;">Bob Johnson</td><td style="border-color:#374151;">bob@example.com</td><td style="border-color:#374151;">Consumer</td><td style="border-color:#374151;">1,420 PTS</td><td style="border-color:#374151;">38 scans</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '18_reward_rules':
            const doubleState = screenStates['18_reward_rules'].doublePoints;
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar" style="background:#111827; border-right: 1px solid #374151;">
                        <div class="wf-web-logo" style="color:#fff;">
                            <div style="width:24px; height:24px; border:2px solid #fff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📊 Admin Dashboard</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📦 Product Database</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚡ QR Batches</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">👥 Users Directory</li>
                            <li class="wf-web-nav-item active" style="background:#1f2937; color:#fff;">🛠️ Rules Editor</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📈 Export Analytics</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid #374151; padding-top:16px; color:#9ca3af;">🏠 Consumer Portal</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚙️ System Settings</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main" style="background:#111827; color:#fff;">
                        <div class="wf-web-header" style="background:#1f2937; border-bottom: 1px solid #374151;">
                            <h2 class="wf-section-title" style="margin-bottom:0; color:#fff;">Campaign Rules Configurations</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar" style="background:#111827; border-color:#374151; color:#fff;">AD</div>
                                <div class="text-sm bold">System Admin</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content" style="max-width:800px;">
                            <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff; gap:20px;">
                                <h3 class="wf-section-title" style="color:#fff;">Adjust Incentive Parameters</h3>
                                
                                <div class="wf-input-group">
                                    <span class="wf-input-label" style="color:#fff;">Base Loyalty Points Awarded per scan</span>
                                    <input type="text" class="wf-input" value="50" style="background:#111827; border-color:#374151; color:#fff;" disabled>
                                </div>

                                <div class="wf-input-group mt-2">
                                    <span class="wf-input-label" style="color:#fff;">New Consumer SSO Signup Bonus Points</span>
                                    <input type="text" class="wf-input" value="350" style="background:#111827; border-color:#374151; color:#fff;" disabled>
                                </div>

                                <div class="flex justify-between items-center mt-4 pt-4" style="border-top:1px solid #374151;">
                                    <div>
                                        <div style="font-weight:bold; font-size:14px;">Widescreen Double Points Promotion Campaign</div>
                                        <p class="text-xs text-gray-400">Enforce double point increments for scan verification operations system-wide.</p>
                                    </div>
                                    <div class="wf-toggle-switch ${doubleState ? 'active' : ''}"></div>
                                </div>
                            </div>
                            <button class="wf-btn wf-btn-primary mt-4" style="background:#fff; color:#000; border:none; padding: 12px 28px;">Save System Rules</button>
                        </div>
                    </div>
                </div>
            `;
            
        case '19_reports':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar" style="background:#111827; border-right: 1px solid #374151;">
                        <div class="wf-web-logo" style="color:#fff;">
                            <div style="width:24px; height:24px; border:2px solid #fff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📊 Admin Dashboard</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">📦 Product Database</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚡ QR Batches</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">👥 Users Directory</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">🛠️ Rules Editor</li>
                            <li class="wf-web-nav-item active" style="background:#1f2937; color:#fff;">📈 Export Analytics</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid #374151; padding-top:16px; color:#9ca3af;">🏠 Consumer Portal</li>
                            <li class="wf-web-nav-item" style="color:#9ca3af;">⚙️ System Settings</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main" style="background:#111827; color:#fff;">
                        <div class="wf-web-header" style="background:#1f2937; border-bottom: 1px solid #374151;">
                            <h2 class="wf-section-title" style="margin-bottom:0; color:#fff;">System Analytics & Export</h2>
                            <div class="flex items-center gap-2">
                                <div class="wf-item-avatar" style="background:#111827; border-color:#374151; color:#fff;">AD</div>
                                <div class="text-sm bold">System Admin</div>
                            </div>
                        </div>
                        
                        <div class="wf-web-content" style="max-width:900px;">
                            <div class="wf-col-grid-2">
                                <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff; gap:20px;">
                                    <h3 class="wf-section-title" style="color:#fff;">Download Export Logs</h3>
                                    
                                    <div class="wf-input-group">
                                        <span class="wf-input-label" style="color:#fff;">Report Type Scope</span>
                                        <div style="background:#111827; border: 1px solid #374151; border-radius: 6px; padding: 12px; font-size:13px;">Product Verification Velocity Index Ledger</div>
                                    </div>
                                    
                                    <div class="flex gap-4">
                                        <button class="wf-btn wf-btn-secondary" style="flex:1; background:#111827; border-color:#374151; color:#fff;">Download CSV log</button>
                                        <button class="wf-btn wf-btn-primary" style="flex:1; background:#fff; color:#000; border:none;">Download PDF Ledger</button>
                                    </div>
                                </div>
                                <div class="wf-card" style="background:#1f2937; border-color:#374151; color:#fff;">
                                    <h3 class="wf-section-title" style="color:#fff;">Export Parameters</h3>
                                    <p class="text-xs text-gray-400">Database values are generated in conformity with blockchain hash blocks. Export operations might take up to 3 minutes during heavy log validation audits.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case '20_settings':
            return `
                <div class="wf-web-shell">
                    <!-- Left Sidebar Nav -->
                    <div class="wf-web-sidebar">
                        <div class="wf-web-logo">
                            <div style="width:24px; height:24px; border:2px solid #000; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold;">IOP</div>
                            <span>InPackOnPack</span>
                        </div>
                        <ul class="wf-web-nav">
                            <li class="wf-web-nav-item">🏠 Dashboard</li>
                            <li class="wf-web-nav-item">📷 Web Scan QR</li>
                            <li class="wf-web-nav-item">💳 My Wallet</li>
                            <li class="wf-web-nav-item">🎁 Rewards Store</li>
                            <li class="wf-web-nav-item">🥗 Eco & Nutrition</li>
                            <li class="wf-web-nav-item">🕒 Activity History</li>
                            <li class="wf-web-nav-item">👤 Profile settings</li>
                            <li class="wf-web-nav-item" style="margin-top:20px; border-top: 1px solid var(--wf-border-light); padding-top:16px;">⚙️ Admin System</li>
                            <li class="wf-web-nav-item active">🛠️ Preferences</li>
                        </ul>
                    </div>

                    <!-- Main Portal Layout -->
                    <div class="wf-web-main">
                        <div class="wf-web-header">
                            <h2 class="wf-section-title" style="margin-bottom:0;">System Preference Settings</h2>
                            <button class="wf-btn wf-btn-secondary">← Back to Portal</button>
                        </div>
                        
                        <div class="wf-web-content" style="max-width:800px;">
                            <div class="wf-card" style="gap:20px;">
                                <h3 class="wf-section-title">Security & Notifications</h3>
                                
                                <div class="flex justify-between items-center">
                                    <div>
                                        <div style="font-weight:bold; font-size:14px;">Desktop Push Alerts</div>
                                        <p class="text-xs text-gray-500">Notify user immediately on scan validations or wallet tier changes.</p>
                                    </div>
                                    <div class="wf-toggle-switch active"></div>
                                </div>

                                <div class="flex justify-between items-center mt-2 pt-2" style="border-top: 1px solid var(--wf-border-light);">
                                    <div>
                                        <div style="font-weight:bold; font-size:14px;">Widescreen Dark Mode</div>
                                        <p class="text-xs text-gray-500">Toggle dark styling across dashboard screens.</p>
                                    </div>
                                    <div class="wf-toggle-switch"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        default:
            return `<div class="wf-container"><p>Screen not found</p></div>`;
    }
}

// Initialize Sidebar Screen Lists
function initSidebar() {
    const userList = document.getElementById('flow-user-list');
    const adminList = document.getElementById('flow-admin-list');
    userList.innerHTML = '';
    adminList.innerHTML = '';

    screens.forEach(screen => {
        const li = document.createElement('li');
        li.className = `screen-item ${screen.id === activeScreenId ? 'active' : ''}`;
        li.id = `sidebar-item-${screen.id}`;
        li.onclick = () => selectScreen(screen.id);
        
        // Simple screen icon svg
        li.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            <span>${screen.name}</span>
        `;
        
        if (screen.type === 'user') {
            userList.appendChild(li);
        } else {
            adminList.appendChild(li);
        }
    });
}

// Select a screen (called from Sidebar list click)
function selectScreen(screenId) {
    activeScreenId = screenId;
    
    // Update sidebar highlights
    document.querySelectorAll('.screen-item').forEach(item => item.classList.remove('active'));
    const sidebarItem = document.getElementById(`sidebar-item-${screenId}`);
    if (sidebarItem) sidebarItem.classList.add('active');
    
    if (currentMode === 'canvas') {
        scrollToCanvasFrame(screenId);
    } else {
        renderPrototypeScreen(screenId);
    }

    updatePropertiesPanel();
}

// Scroll canvas viewport to center the selected frame card
function scrollToCanvasFrame(screenId) {
    const frameElement = document.getElementById(`canvas-frame-${screenId}`);
    if (!frameElement) return;

    const container = document.getElementById('canvasContainer');
    const viewport = document.getElementById('canvasViewport');

    // Compute coordinate relative to the large canvas container
    const targetX = frameElement.offsetLeft + (frameElement.offsetWidth / 2) - (viewport.offsetWidth / (2 * zoom));
    const targetY = frameElement.offsetTop + (frameElement.offsetHeight / 2) - (viewport.offsetHeight / (2 * zoom));

    // Smoothly pan to this coordinate
    panX = -targetX * zoom + (viewport.offsetWidth / 2);
    panY = -targetY * zoom + (viewport.offsetHeight / 2);
    
    // Boundary check
    clampPan();
    applyZoomPanTransform();
}

// Clamping zoom offsets (adjusted for 8200x4800 canvas)
function clampPan() {
    const viewport = document.getElementById('canvasViewport');
    const minPanX = -8200 * zoom + viewport.offsetWidth;
    const minPanY = -4800 * zoom + viewport.offsetHeight;
    
    panX = Math.max(minPanX, Math.min(100, panX));
    panY = Math.max(minPanY, Math.min(100, panY));
}

// Toggle Left Panel flow categories
function toggleCategory(catId) {
    const title = document.querySelector(`.category-title[onclick="toggleCategory('${catId}')"]`);
    const list = document.getElementById(`${catId}-list`);
    title.classList.toggle('collapsed');
    list.classList.toggle('collapsed');
}

// Filter screen titles in left panel search
function filterScreens() {
    const query = document.getElementById('screenSearch').value.toLowerCase();
    
    screens.forEach(screen => {
        const item = document.getElementById(`sidebar-item-${screen.id}`);
        if (!item) return;

        if (screen.name.toLowerCase().includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Render 20 screens as an artboard list in Canvas Mode
function initCanvasView() {
    const userGrid = document.getElementById('userFlowGrid');
    const adminGrid = document.getElementById('adminFlowGrid');
    userGrid.innerHTML = '';
    adminGrid.innerHTML = '';

    screens.forEach(screen => {
        // Create canvas frame card
        const card = document.createElement('div');
        card.className = 'canvas-frame-card';
        card.id = `canvas-frame-${screen.id}`;
        
        card.innerHTML = `
            <div class="canvas-frame-header">
                <span class="frame-label">${screen.name}</span>
                <span class="frame-size-label">1280 x 720 px</span>
            </div>
            <div class="browser-mockup" style="box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <div class="browser-header">
                    <div class="browser-dots">
                        <span class="dot close"></span>
                        <span class="dot minimize"></span>
                        <span class="dot expand"></span>
                    </div>
                    <div class="browser-nav">
                        <span style="font-size: 13px; color: #4b5563;">←</span>
                        <span style="font-size: 13px; color: #4b5563; margin-left: 8px;">→</span>
                    </div>
                    <div class="browser-address" style="max-width: 400px;">
                        <span class="address-lock">🔒</span>
                        <span class="address-text">${screen.url}</span>
                    </div>
                </div>
                <div class="browser-screen-container">
                    <div class="browser-screen">
                        ${getScreenHtml(screen.id)}
                    </div>
                </div>
            </div>
        `;
        
        // Double click frame to focus and enter Prototype Play mode
        card.addEventListener('dblclick', () => {
            selectScreen(screen.id);
            setMode('prototype');
        });
        // Click highlights screen specs
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            selectScreen(screen.id);
        });

        if (screen.type === 'user') {
            userGrid.appendChild(card);
        } else {
            adminGrid.appendChild(card);
        }
    });

    // Draw prototype arrows in design mode
    setTimeout(drawCanvasConnectors, 200);
}

// Helper to calculate absolute offset relative to a container
function getAbsoluteOffset(element, container) {
    let top = 0;
    let left = 0;
    let el = element;
    while (el && el !== container) {
        top += el.offsetTop;
        left += el.offsetLeft;
        el = el.offsetParent;
    }
    return { top, left };
}

// Draw prototype connection lines on Canvas using SVG paths
function drawCanvasConnectors() {
    const svg = document.getElementById('svgOverlay');
    const container = document.getElementById('canvasContainer');
    svg.innerHTML = ''; // clear previous lines
    
    // Add arrowhead definitions
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0c8ce9" />
        </marker>
    `;
    svg.appendChild(defs);

    screens.forEach(screen => {
        const sourceFrame = document.getElementById(`canvas-frame-${screen.id}`);
        if (!sourceFrame) return;

        screen.hotspots.forEach(hotspot => {
            if (hotspot.target.startsWith('action:')) return; // skip custom code actions

            let targetId = hotspot.target;
            if (targetId === 'back_contextual') {
                targetId = screen.type === 'admin' ? '14_admin_dashboard' : '04_dashboard';
            }

            const targetFrame = document.getElementById(`canvas-frame-${targetId}`);
            if (!targetFrame) return;

            const sourceOffset = getAbsoluteOffset(sourceFrame, container);
            const targetOffset = getAbsoluteOffset(targetFrame, container);

            // Find center offsets of source and target frames relative to the absolute canvas layout
            const sx = sourceOffset.left + (sourceFrame.offsetWidth / 2);
            const sy = sourceOffset.top + (sourceFrame.offsetHeight / 2);
            const tx = targetOffset.left + (targetFrame.offsetWidth / 2);
            const ty = targetOffset.top + (targetFrame.offsetHeight / 2);

            // Create bezier curved connector path
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            // Generate standard control points for curve
            const dx = Math.abs(tx - sx);
            const controlOffset = Math.min(dx * 0.4, 250);
            
            let d;
            if (tx >= sx) {
                // Flowing forward
                d = `M ${sourceOffset.left + sourceFrame.offsetWidth} ${sy} C ${sourceOffset.left + sourceFrame.offsetWidth + controlOffset} ${sy}, ${targetOffset.left - controlOffset} ${ty}, ${targetOffset.left} ${ty}`;
            } else {
                // Flowing backwards/looping
                d = `M ${sourceOffset.left} ${sy} C ${sourceOffset.left - controlOffset} ${sy}, ${targetOffset.left + targetFrame.offsetWidth + controlOffset} ${ty}, ${targetOffset.left + targetFrame.offsetWidth} ${ty}`;
            }

            path.setAttribute("d", d);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "#0c8ce9");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-dasharray", "4,4");
            path.setAttribute("marker-end", "url(#arrow)");
            path.style.opacity = "0.45";

            // Hover effect on lines
            path.addEventListener('mouseover', () => {
                path.style.opacity = "1";
                path.setAttribute("stroke-width", "3");
            });
            path.addEventListener('mouseout', () => {
                path.style.opacity = "0.45";
                path.setAttribute("stroke-width", "2");
            });

            svg.appendChild(path);
        });
    });
}

// Mode Switch (Canvas vs Prototype View)
function setMode(mode) {
    currentMode = mode;
    
    // Toggle header button classes
    document.getElementById('btnCanvasMode').classList.toggle('active', mode === 'canvas');
    document.getElementById('btnPrototypeMode').classList.toggle('active', mode === 'prototype');
    
    // Toggle view elements
    document.getElementById('canvasViewport').classList.toggle('hidden', mode !== 'canvas');
    document.getElementById('prototypeViewport').classList.toggle('hidden', mode !== 'prototype');
    
    if (mode === 'canvas') {
        initCanvasView();
        applyZoomPanTransform();
    } else {
        renderPrototypeScreen(activeScreenId);
    }

    updatePropertiesPanel();
}

// Renders the single active screen for Prototype Play Mode
function renderPrototypeScreen(screenId) {
    const screenElement = document.getElementById('phoneScreen');
    const screenNameLabel = document.getElementById('protoScreenName');
    const browserUrlLabel = document.getElementById('mockBrowserUrl');
    
    const screen = screens.find(s => s.id === screenId);
    if (!screen) return;
    
    activeScreenId = screenId;
    isAdmin = (screen.type === 'admin');
    
    screenNameLabel.textContent = screen.name;
    browserUrlLabel.textContent = screen.url;
    
    // Inject rendered B&W layout HTML
    screenElement.innerHTML = getScreenHtml(screenId);
    
    // Append hotspots overlays
    const overlaysContainer = document.createElement('div');
    overlaysContainer.style.position = 'absolute';
    overlaysContainer.style.top = '0';
    overlaysContainer.style.left = '0';
    overlaysContainer.style.width = '100%';
    overlaysContainer.style.height = '100%';
    overlaysContainer.style.pointerEvents = 'none'; // click filters to buttons, helper handles clicks
    
    screen.hotspots.forEach(hotspot => {
        const hotspotDiv = document.createElement('div');
        hotspotDiv.className = 'hotspot';
        hotspotDiv.style.top = hotspot.top;
        hotspotDiv.style.left = hotspot.left;
        hotspotDiv.style.width = hotspot.width;
        hotspotDiv.style.height = hotspot.height;
        hotspotDiv.style.pointerEvents = 'auto'; // allow click
        
        hotspotDiv.title = hotspot.label;
        
        hotspotDiv.onclick = (e) => {
            e.stopPropagation();
            handleHotspotClick(hotspot.target);
        };
        
        overlaysContainer.appendChild(hotspotDiv);
    });
    
    screenElement.appendChild(overlaysContainer);

    // Bind dynamic in-screen clicks that are not direct hotspots (e.g. scratch card, local confirmation overlays)
    bindInternalActions(screenId);
}

// Local interactive state triggers inside mobile screen container
function bindInternalActions(screenId) {
    const screenContainer = document.getElementById('phoneScreen');

    if (screenId === '07_instant_win') {
        const card = screenContainer.querySelector('.wf-scratch-card');
        if (card) {
            card.onclick = () => {
                screenStates['07_instant_win'].revealed = true;
                renderPrototypeScreen('07_instant_win');
            };
        }
    }
    
    if (screenId === '10_redeem') {
        // Redirection buttons logic
        const primaryBtn = screenContainer.querySelector('.wf-btn-primary');
        if (primaryBtn && screenStates['10_redeem'].step === 'detail') {
            primaryBtn.onclick = () => {
                screenStates['10_redeem'].step = 'confirming';
                renderPrototypeScreen('10_redeem');
            };
        }
        
        const doneBtn = screenContainer.querySelector('.wf-btn-primary');
        if (doneBtn && screenStates['10_redeem'].step === 'completed') {
            doneBtn.onclick = () => {
                screenStates['10_redeem'].step = 'detail';
                selectScreen('08_wallet');
            };
        }
    }
    
    if (screenId === '18_reward_rules') {
        const switchEl = screenContainer.querySelector('.wf-toggle-switch');
        if (switchEl) {
            switchEl.onclick = () => {
                const current = screenStates['18_reward_rules'].doublePoints;
                screenStates['18_reward_rules'].doublePoints = !current;
                renderPrototypeScreen('18_reward_rules');
            };
        }
    }

    if (screenId === '04_dashboard') {
        const mainCard = screenContainer.querySelector('.wf-card.dark');
        if (mainCard) {
            mainCard.onclick = () => selectScreen('08_wallet');
        }
        const scanBtn = screenContainer.querySelector('.wf-btn-primary');
        if (scanBtn) {
            scanBtn.onclick = () => selectScreen('05_scan_qr');
        }
    }

    if (screenId === '05_scan_qr') {
        const webcam = screenContainer.querySelector('.wf-webcam-feed');
        if (webcam) {
            webcam.onclick = () => selectScreen('06_scan_success');
        }
    }

    if (screenId === '06_scan_success') {
        const primaryBtn = screenContainer.querySelector('.wf-btn-primary');
        if (primaryBtn) {
            primaryBtn.onclick = () => selectScreen('07_instant_win');
        }
        const secondaryBtn = screenContainer.querySelector('.wf-btn-secondary');
        if (secondaryBtn) {
            secondaryBtn.onclick = () => selectScreen('04_dashboard');
        }
    }

    if (screenId === '11_nutrition') {
        const scanBtn = screenContainer.querySelector('.wf-btn-primary');
        if (scanBtn) {
            scanBtn.onclick = () => selectScreen('05_scan_qr');
        }
    }

    if (screenId === '13_profile') {
        const logoutBtn = screenContainer.querySelector('.wf-btn-secondary');
        if (logoutBtn) {
            logoutBtn.onclick = () => selectScreen('02_login');
        }
    }

    if (screenId === '20_settings') {
        const backBtn = screenContainer.querySelector('.wf-btn-secondary');
        if (backBtn) {
            backBtn.onclick = () => selectScreen(isAdmin ? '14_admin_dashboard' : '04_dashboard');
        }
    }
}

// Step actions triggered by popups
function cancelRedeemStep() {
    screenStates['10_redeem'].step = 'detail';
    renderPrototypeScreen('10_redeem');
}

function completeRedeemStep() {
    screenStates['10_redeem'].step = 'completed';
    renderPrototypeScreen('10_redeem');
}

// Handle Hotspot navigations (including custom functions like toggles)
function handleHotspotClick(target) {
    if (target.startsWith('action:')) {
        const actionName = target.split(':')[1];
        executeAction(actionName);
        return;
    }
    
    if (target === 'back_contextual') {
        selectScreen(isAdmin ? '14_admin_dashboard' : '04_dashboard');
        return;
    }
    
    selectScreen(target);
}

// Executes action-based routes
function executeAction(actionName) {
    if (actionName === 'scratch') {
        screenStates['07_instant_win'].revealed = true;
        renderPrototypeScreen('07_instant_win');
    }
    else if (actionName === 'confirm_redeem') {
        screenStates['10_redeem'].step = 'confirming';
        renderPrototypeScreen('10_redeem');
    }
    else if (actionName === 'toggle_double_pts') {
        const current = screenStates['18_reward_rules'].doublePoints;
        screenStates['18_reward_rules'].doublePoints = !current;
        renderPrototypeScreen('18_reward_rules');
    }
}

// Toggle highlight flash effect of clickable hotspots
function toggleHotspots() {
    showHotspots = !showHotspots;
    document.body.classList.toggle('show-hotspots', showHotspots);
}

// Prototype control helpers
function restartPrototype() {
    screenStates['07_instant_win'].revealed = false;
    screenStates['10_redeem'].step = 'detail';
    selectScreen('01_splash');
}

function prevPrototypeScreen() {
    const screenIndex = screens.findIndex(s => s.id === activeScreenId);
    if (screenIndex > 0) {
        selectScreen(screens[screenIndex - 1].id);
    }
}

// Update the right properties inspector panel details
function updatePropertiesPanel() {
    const linksList = document.getElementById('interactionLinksList');
    const defaultText = document.getElementById('interactionDefaultText');
    linksList.innerHTML = '';
    
    const activeScreen = screens.find(s => s.id === activeScreenId);
    if (!activeScreen || activeScreen.hotspots.length === 0) {
        defaultText.style.display = 'block';
        return;
    }
    
    defaultText.style.display = 'none';
    
    activeScreen.hotspots.forEach(hotspot => {
        const li = document.createElement('li');
        li.className = 'interaction-link-item';
        
        let targetLabel = hotspot.target;
        if (hotspot.target.startsWith('action:')) {
            targetLabel = `Custom action [${hotspot.target.split(':')[1]}]`;
        } else if (hotspot.target === 'back_contextual') {
            targetLabel = 'Dashboard (Contextual)';
        } else {
            const tgt = screens.find(s => s.id === hotspot.target);
            if (tgt) targetLabel = tgt.name;
        }

        li.innerHTML = `
            <span class="trigger">On Click (Hotspot: ${hotspot.label})</span>
            <span class="target">Navigate to: ${targetLabel}</span>
        `;
        
        li.onclick = () => {
            handleHotspotClick(hotspot.target);
        };

        linksList.appendChild(li);
    });
}

// ==========================================
// Zooming and Panning Canvas Controls
// ==========================================
function zoomIn() {
    if (zoom < 1.5) {
        zoom += 0.05;
        applyZoomPanTransform();
    }
}

// zoomed out values tweaked for 1280px artboards
function zoomOut() {
    if (zoom > 0.2) {
        zoom -= 0.05;
        applyZoomPanTransform();
    }
}

function resetZoom() {
    zoom = 0.5; // fits nicely
    panX = 60;
    panY = 40;
    applyZoomPanTransform();
}

function applyZoomPanTransform() {
    const container = document.getElementById('canvasContainer');
    const zoomLabel = document.getElementById('zoomLevel');
    
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    container.style.transform = `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`;
}

// Mouse dragging pan handler
function initPanEngine() {
    const viewport = document.getElementById('canvasViewport');
    
    viewport.addEventListener('mousedown', (e) => {
        if (currentMode !== 'canvas') return;
        
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        clampPan();
        applyZoomPanTransform();
    });

    window.addEventListener('mouseup', () => {
        isPanning = false;
    });

    viewport.addEventListener('wheel', (e) => {
        if (currentMode !== 'canvas') return;
        
        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }
    }, { passive: false });
}

// ==========================================
// Share Modal Dialog Controls
// ==========================================
function openShareModal() {
    const modal = document.getElementById('shareModal');
    const shareInput = document.getElementById('shareUrlInput');
    shareInput.value = window.location.href;
    modal.classList.remove('hidden');
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    modal.classList.add('hidden');
    document.getElementById('copySuccessMsg').classList.add('hidden');
}

function copyShareLink() {
    const shareInput = document.getElementById('shareUrlInput');
    shareInput.select();
    document.execCommand('copy');
    
    const successMsg = document.getElementById('copySuccessMsg');
    successMsg.classList.remove('hidden');
}

// ==========================================
// App Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initCanvasView();
    initPanEngine();
    
    document.body.classList.add('show-hotspots');
    
    // Set default initial zoom to 0.5 for web screens
    resetZoom();
});
