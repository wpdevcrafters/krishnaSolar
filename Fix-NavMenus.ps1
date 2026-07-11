
# Fix-NavMenus.ps1
# Applies correct, interlinked nav menus across all site pages

$root = "c:\xampp\htdocs\krishnaSolar\HTML"

# ─── NAV SNIPPETS ──────────────────────────────────────────────────────────────
# We define two variants: root-level pages and calculators/ sub-pages

function Get-NavHTML {
    param(
        [string]$HomeLink,
        [string]$ServicesLink,
        [string]$CalcLink,
        [string]$ContactLink,
        [string]$LogoPath,
        [string]$CssPath,
        [string]$ActivePage,   # "home","services","calculators","contact"
        [string]$CTALink
    )

    $homeActive      = if ($ActivePage -eq "home")        { " active" } else { "" }
    $servicesActive  = if ($ActivePage -eq "services")    { " active" } else { "" }
    $calcActive      = if ($ActivePage -eq "calculators") { " active" } else { "" }
    $contactActive   = if ($ActivePage -eq "contact")     { " active" } else { "" }

    return @"
<header class="header">
    <nav class="navbar navbar-expand-xl navbar-light">
        <div class="container">
            <!-- Logo -->
            <a class="navbar-brand" href="$HomeLink">
                <img src="$LogoPath" alt="ShriKrishna Solar" class="header-logo">
            </a>

            <!-- Tablet: WhatsApp + CTA (md to xl) -->
            <div class="header-tablet-actions d-none d-md-flex d-xl-none align-items-center gap-2 ms-auto me-3">
                <a href="https://wa.me/919876543210"
                   class="btn btn-outline-success rounded-circle whatsapp-btn d-flex align-items-center justify-content-center shadow-sm"
                   target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                    <i class="bi bi-whatsapp fs-5"></i>
                </a>
                <a href="$CTALink" class="btn btn-warning header-cta text-white fw-semibold px-3 py-2 shadow-sm">
                    Book Free Solar Consultation
                </a>
            </div>

            <!-- Hamburger -->
            <button class="navbar-toggler d-xl-none" type="button"
                    data-bs-toggle="offcanvas" data-bs-target="#navDrawer"
                    aria-controls="navDrawer" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Mobile / Tablet Drawer -->
            <div class="offcanvas offcanvas-end d-xl-none" tabindex="-1" id="navDrawer" aria-labelledby="navDrawerLabel">
                <div class="offcanvas-header border-bottom">
                    <a href="$HomeLink" class="navbar-brand mb-0">
                        <img src="$LogoPath" alt="ShriKrishna Solar" class="drawer-logo">
                    </a>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body d-flex flex-column p-0">
                    <ul class="navbar-nav px-3 py-2 flex-grow-1">
                        <li class="nav-item">
                            <a class="nav-link$homeActive" href="$HomeLink">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link$servicesActive" href="$ServicesLink">Services</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link$calcActive" href="$CalcLink">Solar Calculator</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link$contactActive" href="$ContactLink">Contact</a>
                        </li>
                    </ul>
                    <!-- Mobile-only CTA block -->
                    <div class="d-flex d-md-none flex-column gap-2 px-3 py-3 border-top">
                        <a href="$CTALink"
                           class="btn btn-warning header-cta text-white fw-semibold py-2 shadow-sm justify-content-center w-100"
                           data-bs-dismiss="offcanvas">
                            Book Free Solar Consultation
                        </a>
                        <a href="https://wa.me/919876543210"
                           class="btn btn-outline-success d-flex align-items-center justify-content-center gap-2 py-2"
                           target="_blank" rel="noopener noreferrer">
                            <i class="bi bi-whatsapp fs-5"></i> WhatsApp Us
                        </a>
                    </div>
                </div>
            </div>

            <!-- Desktop Nav -->
            <div class="collapse navbar-collapse d-none d-xl-flex" id="mainNav">
                <ul class="navbar-nav mx-auto mb-2 mb-xl-0 fw-medium">
                    <li class="nav-item">
                        <a class="nav-link$homeActive" href="$HomeLink">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link$servicesActive" href="$ServicesLink">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link$calcActive" href="$CalcLink">Solar Calculator</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link$contactActive" href="$ContactLink">Contact</a>
                    </li>
                </ul>
                <div class="d-flex align-items-center gap-3">
                    <a href="https://wa.me/919876543210"
                       class="btn btn-outline-success rounded-circle whatsapp-btn d-flex align-items-center justify-content-center shadow-sm"
                       target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                        <i class="bi bi-whatsapp fs-5"></i>
                    </a>
                    <a href="$CTALink" class="btn btn-warning header-cta text-white fw-semibold px-4 py-2 shadow-sm">
                        Book Free Solar Consultation
                    </a>
                </div>
            </div>

        </div>
    </nav>
</header>
"@
}

# ─── FOOTER SNIPPET ─────────────────────────────────────────────────────────────
function Get-FooterHTML {
    param([string]$HomeLink, [string]$ServicesLink, [string]$CalcLink, [string]$ContactLink, [string]$FooterLogoPath)
    return @"
<footer class="site-footer" role="contentinfo">
    <div class="container">
        <div class="site-footer__grid">
            <!-- Brand -->
            <div class="site-footer__brand">
                <a href="$HomeLink" class="site-footer__logo" aria-label="ShriKrishna Solar home">
                    <img src="$FooterLogoPath" alt="ShriKrishna Solar" width="855" height="292" loading="lazy">
                </a>
                <p class="site-footer__text">Your trusted partner for rooftop solar solutions in Kharagpur, West Bengal. We help you save more, save energy, and build a sustainable future.</p>
                <ul class="site-footer__social list-unstyled" aria-label="Social media links">
                    <li><a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a></li>
                    <li><a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a></li>
                    <li><a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a></li>
                    <li><a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a></li>
                </ul>
            </div>
            <!-- Quick Links -->
            <nav class="site-footer__col" aria-label="Footer quick links">
                <h2 class="site-footer__title">Quick Links</h2>
                <ul class="site-footer__links list-unstyled">
                    <li><a href="$HomeLink">Home</a></li>
                    <li><a href="$ServicesLink">Services</a></li>
                    <li><a href="$CalcLink">Solar Calculator</a></li>
                    <li><a href="$ContactLink">Contact Us</a></li>
                </ul>
            </nav>
            <!-- Services -->
            <div class="site-footer__col">
                <h2 class="site-footer__title">Our Services</h2>
                <ul class="site-footer__links list-unstyled">
                    <li>Rooftop Solar Installation</li>
                    <li>Solar System Design</li>
                    <li>Net Metering Support</li>
                    <li>Solar Maintenance (AMC)</li>
                    <li>Subsidy Assistance</li>
                </ul>
            </div>
            <!-- Contact -->
            <address class="site-footer__col site-footer__contact">
                <h2 class="site-footer__title">Contact Us</h2>
                <ul class="site-footer__contact-list list-unstyled">
                    <li>
                        <i class="bi bi-geo-alt-fill"></i>
                        <span>ShriKrishna Solar Pvt. Ltd.<br>Kharagpur, West Bengal &ndash; 721301</span>
                    </li>
                    <li><i class="bi bi-telephone-fill"></i><a href="tel:+919876543210">+91 98765 43210</a></li>
                    <li><i class="bi bi-envelope-fill"></i><a href="mailto:info@shrikrishnasolar.in">info@shrikrishnasolar.in</a></li>
                    <li><i class="bi bi-clock-fill"></i><span>Mon &ndash; Sat &nbsp;9 AM &ndash; 7 PM</span></li>
                </ul>
            </address>
        </div>
        <div class="site-footer__bottom">
            <p>&copy; <span id="footer-year">2026</span> ShriKrishna Solar Pvt. Ltd. All Rights Reserved.</p>
            <nav class="site-footer__legal" aria-label="Footer legal links">
                <a href="#">Privacy Policy</a><span>|</span>
                <a href="#">Terms &amp; Conditions</a><span>|</span>
                <a href="#">Refund Policy</a>
            </nav>
        </div>
    </div>
</footer>
"@
}

# ─── PROCESS EACH PAGE ────────────────────────────────────────────────────────

# 1. ROOT-LEVEL PAGES (services.html, calculators.html, contact.html)
$rootPages = @(
    @{ File="services.html";    Active="services";    CTA="contact.html" },
    @{ File="calculators.html"; Active="calculators"; CTA="contact.html" },
    @{ File="contact.html";     Active="contact";     CTA="contact.html" }
)

foreach ($p in $rootPages) {
    $filePath = Join-Path $root $p.File
    if (-not (Test-Path $filePath)) { Write-Host "SKIP: $($p.File)"; continue }

    $newHeader = Get-NavHTML `
        -HomeLink      "index.html" `
        -ServicesLink  "services.html" `
        -CalcLink      "calculators.html" `
        -ContactLink   "contact.html" `
        -LogoPath      "assets/image/logo.png" `
        -CssPath       "assets/css/style.css" `
        -ActivePage    $p.Active `
        -CTALink       $p.CTA

    $newFooter = Get-FooterHTML `
        -HomeLink      "index.html" `
        -ServicesLink  "services.html" `
        -CalcLink      "calculators.html" `
        -ContactLink   "contact.html" `
        -FooterLogoPath "assets/image/footerlogo.png"

    $content = Get-Content $filePath -Raw -Encoding UTF8

    # Replace header block
    $content = [regex]::Replace($content, '(?s)<header class="header">.*?</header>', $newHeader)

    # Replace footer block
    $content = [regex]::Replace($content, '(?s)<footer class="site-footer"[^>]*>.*?</footer>', $newFooter)

    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Fixed nav: $($p.File)"
}

# 2. CALCULATOR SUB-PAGES (calculators/*.html)
$calcDir = Join-Path $root "calculators"
$calcFiles = Get-ChildItem "$calcDir\*.html" | Select-Object -ExpandProperty FullName

foreach ($filePath in $calcFiles) {
    $fileName = Split-Path $filePath -Leaf

    $newHeader = Get-NavHTML `
        -HomeLink      "../index.html" `
        -ServicesLink  "../services.html" `
        -CalcLink      "../calculators.html" `
        -ContactLink   "../contact.html" `
        -LogoPath      "../assets/image/logo.png" `
        -CssPath       "../assets/css/style.css" `
        -ActivePage    "calculators" `
        -CTALink       "../contact.html"

    $newFooter = Get-FooterHTML `
        -HomeLink      "../index.html" `
        -ServicesLink  "../services.html" `
        -CalcLink      "../calculators.html" `
        -ContactLink   "../contact.html" `
        -FooterLogoPath "../assets/image/footerlogo.png"

    $content = Get-Content $filePath -Raw -Encoding UTF8

    # Replace header block
    $content = [regex]::Replace($content, '(?s)<header class="header">.*?</header>', $newHeader)

    # Replace footer block
    $content = [regex]::Replace($content, '(?s)<footer class="site-footer"[^>]*>.*?</footer>', $newFooter)

    # Also fix any remaining stray "../index.html" → should be "../index.html" (already correct for sub-pages)
    # Fix CTA links inside calculator section that still point to "../contact.html" — ensure they're correct
    # (They should already be correct from the build script)

    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Fixed nav: calculators/$fileName"
}

# 3. FIX index.html — logo link + WhatsApp number + nav links
$indexPath = Join-Path $root "index.html"
$indexContent = Get-Content $indexPath -Raw -Encoding UTF8

# Fix logo link (was href="#", should link to index page)
$indexContent = $indexContent -replace 'class="navbar-brand" href="#"', 'class="navbar-brand" href="index.html"'
$indexContent = $indexContent -replace 'class="navbar-brand mb-0">\s*<img src="assets/image/logo.png"', 'class="navbar-brand mb-0"><img src="assets/image/logo.png"'

# Fix WhatsApp number from 1234567890 to 919876543210
$indexContent = $indexContent -replace 'wa\.me/1234567890', 'wa.me/919876543210'

# Add Services link — update nav links in index to include services page
# In drawer nav: after Home, add Services before Residential Solar
$indexContent = $indexContent -replace '(<li class="nav-item">\s*<a class="nav-link active" href="#"\s*>Home</a>\s*</li>\s*<li class="nav-item has-submenu">)', '<li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li><li class="nav-item"><a class="nav-link" href="services.html">Services</a></li><li class="nav-item has-submenu">'

# Fix Solar Calculator link in drawer to point to calculators.html
$indexContent = $indexContent -replace '<a class="nav-link" href="#calculator">Solar Calculator</a>', '<a class="nav-link" href="calculators.html">Solar Calculator</a>'

# Fix Contact link in drawer to point to contact.html
$indexContent = $indexContent -replace '<a class="nav-link" href="#contact">Contact</a>', '<a class="nav-link" href="contact.html">Contact</a>'

# Fix desktop nav: Add Services link after Home
$indexContent = $indexContent -replace '(<li class="nav-item">\s*<a class="nav-link active" href="#"\s*>Home</a>\s*</li>\s*<li class="nav-item has-submenu position-static">)', '<li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li><li class="nav-item"><a class="nav-link" href="services.html">Services</a></li><li class="nav-item has-submenu position-static">'

# Fix desktop Solar Calculator link
$indexContent = $indexContent -replace '<a class="nav-link" href="#calculator">Solar Calculator</a>', '<a class="nav-link" href="calculators.html">Solar Calculator</a>'

# Fix desktop Contact link
$indexContent = $indexContent -replace '<a class="nav-link" href="#contact">Contact</a>', '<a class="nav-link" href="contact.html">Contact</a>'

# Fix index footer links
$indexContent = $indexContent -replace '(?s)<footer class="site-footer"[^>]*>.*?</footer>', (Get-FooterHTML -HomeLink "index.html" -ServicesLink "services.html" -CalcLink "calculators.html" -ContactLink "contact.html" -FooterLogoPath "assets/image/footerlogo.png")

Set-Content -Path $indexPath -Value $indexContent -Encoding UTF8
Write-Host "Fixed nav: index.html"

Write-Host "`nAll nav menus updated successfully!"
