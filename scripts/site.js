// Hamburger menu for the header bar on phones.
// Without this script the page names just show in the bar as normal.
var bar = document.querySelector('.site-bar');
var button = bar && bar.querySelector('.menu-toggle');

if (button) {
    bar.classList.add('has-menu');

    function setOpen(open) {
        bar.classList.toggle('menu-open', open);
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    button.addEventListener('click', function () {
        setOpen(!bar.classList.contains('menu-open'));
    });

    // close with Escape or by tapping anywhere else
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') setOpen(false);
    });
    document.addEventListener('click', function (event) {
        if (!bar.contains(event.target)) setOpen(false);
    });
}

// Page turning on the inner pages: the stand shows two sheets at a time.
// If a page has more, add "turn page" tabs that slide to the next pair.
var stand = document.querySelector('main.front');
var sheets = stand && stand.querySelector('.sheets');

if (sheets) {
    // distance from one pair of sheets to the next
    function spreadWidth() {
        var items = sheets.querySelectorAll('.page-sheet, .desk-column');
        return items.length > 2 ? items[2].offsetLeft - items[0].offsetLeft : sheets.clientWidth;
    }

    function currentSpread() {
        return Math.round(sheets.scrollLeft / spreadWidth());
    }

    function goToSpread(spread, instant) {
        var still = instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        sheets.scrollTo({ left: spread * spreadWidth(), behavior: still ? 'auto' : 'smooth' });
    }

    function makeTab(className, direction) {
        var tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'page-turn ' + className;
        tab.addEventListener('click', function () {
            goToSpread(currentSpread() + direction);
        });
        stand.appendChild(tab);
        return tab;
    }

    var back = makeTab('page-turn-back', -1);
    var next = makeTab('page-turn-next', 1);

    // a page can give the buttons special labels with data-first-next-label
    // (shown on the first spread) and data-second-back-label (second spread)
    function updateTabs() {
        var room = sheets.scrollWidth - sheets.clientWidth;
        var spread = currentSpread();
        back.hidden = sheets.scrollLeft <= 4;
        next.hidden = sheets.scrollLeft >= room - 4;
        next.textContent = (spread === 0 && sheets.dataset.firstNextLabel) || 'Next page \u2192';
        back.textContent = (spread === 1 && sheets.dataset.secondBackLabel) || '\u2190 Previous page';
    }

    // a link like about_us.html#archives opens the stand at that sheet
    function showLinkedSheet(instant) {
        var target = location.hash && document.getElementById(location.hash.slice(1));
        if (!target || !sheets.contains(target)) return;
        // phones stack the sheets: just scroll down to it (again after the
        // photos above have loaded and pushed it further down)
        if (getComputedStyle(sheets).overflowX === 'visible') {
            target.scrollIntoView();
            return;
        }
        var index = Array.prototype.indexOf.call(sheets.querySelectorAll('.page-sheet, .desk-column'), target);
        goToSpread(Math.floor(index / 2), instant);
        window.scrollTo(0, 0);   // keep the whole stand in view
    }

    sheets.addEventListener('scroll', updateTabs);
    window.addEventListener('resize', updateTabs);
    window.addEventListener('hashchange', function () { showLinkedSheet(false); });
    // after the browser's own jump to the #link, line the stand back up
    window.addEventListener('load', function () {
        setTimeout(function () { showLinkedSheet(true); updateTabs(); }, 0);
    });
    showLinkedSheet(true);
    updateTabs();
}

// Home page: hovering a sheet on the stand highlights the same page in the
// header, and hovering a header link lifts the matching sheet (and the
// Donate note on the stand goes with the Donate button).
var standLinks = document.querySelectorAll('.stand a.sheet, .stand a.note');
var headerLinks = document.querySelectorAll('.site-links a');

if (standLinks.length) {
    function partners(link) {
        var href = link.getAttribute('href');
        var all = Array.prototype.slice.call(standLinks).concat(Array.prototype.slice.call(headerLinks));
        return all.filter(function (other) {
            return other !== link && other.getAttribute('href') === href;
        });
    }

    function pair(link) {
        var others = partners(link);
        function on() { others.forEach(function (o) { o.classList.add('is-linked'); }); }
        function off() { others.forEach(function (o) { o.classList.remove('is-linked'); }); }
        link.addEventListener('mouseenter', on);
        link.addEventListener('mouseleave', off);
        link.addEventListener('focus', on);
        link.addEventListener('blur', off);
    }

    Array.prototype.forEach.call(standLinks, pair);
    Array.prototype.forEach.call(headerLinks, pair);
}

// Archive posters and programs: tap or click one to see it full size.
var zoomable = document.querySelectorAll('.archive-sheet .poster img');

if (zoomable.length) {
    var viewer = document.createElement('div');
    viewer.className = 'lightbox';
    viewer.hidden = true;
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'Enlarged image');
    viewer.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="Close">×</button>' +
        '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(viewer);

    var bigImg = viewer.querySelector('img');
    var bigCaption = viewer.querySelector('figcaption');
    var closeButton = viewer.querySelector('.lightbox-close');
    var opener = null;

    function openViewer(img) {
        opener = img;
        bigImg.src = img.currentSrc || img.src;
        bigImg.alt = img.alt;
        var caption = img.closest('figure').querySelector('figcaption');
        bigCaption.textContent = caption ? caption.textContent : '';
        viewer.hidden = false;
        document.body.classList.add('lightbox-open');
        closeButton.focus();
    }

    function closeViewer() {
        viewer.hidden = true;
        document.body.classList.remove('lightbox-open');
        if (opener) opener.focus();
    }

    Array.prototype.forEach.call(zoomable, function (img) {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Enlarge: ' + img.alt);
        img.addEventListener('click', function () { openViewer(img); });
        img.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openViewer(img);
            }
        });
    });

    // tap anywhere (or press Escape) to close
    viewer.addEventListener('click', closeViewer);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !viewer.hidden) closeViewer();
    });
}

// Home page concert pop-up: shows the flyer once per visit, up to (not
// including) the date in data-hide-from on #concertPopup in index.html.
var concertPopup = document.getElementById('concertPopup');

if (concertPopup) {
    var hideFrom = new Date(concertPopup.dataset.hideFrom + 'T00:00:00');
    var seen = false;
    try { seen = sessionStorage.getItem('concertPopupSeen') === '1'; } catch (e) {}

    if (new Date() < hideFrom && !seen) {
        concertPopup.hidden = false;
        setTimeout(function () { concertPopup.classList.add('show'); }, 50);
        try { sessionStorage.setItem('concertPopupSeen', '1'); } catch (e) {}
        concertPopup.querySelector('.close-popup').focus();

        var closePopup = function () {
            concertPopup.classList.remove('show');
            concertPopup.classList.add('closing');
            setTimeout(function () {
                concertPopup.hidden = true;
                concertPopup.classList.remove('closing');
            }, 300);
        };

        concertPopup.querySelector('.close-popup').addEventListener('click', closePopup);
        concertPopup.addEventListener('click', function (event) {
            if (event.target === concertPopup) closePopup();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !concertPopup.hidden) closePopup();
        });
    }
}
