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
    function makeTab(className, label, direction) {
        var tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'page-turn ' + className;
        tab.textContent = label;
        tab.addEventListener('click', function () {
            // distance from one pair of sheets to the next
            var items = sheets.children;
            var step = items.length > 2 ? items[2].offsetLeft - items[0].offsetLeft : sheets.clientWidth;
            var spread = Math.round(sheets.scrollLeft / step) + direction;
            var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            sheets.scrollTo({ left: spread * step, behavior: still ? 'auto' : 'smooth' });
        });
        stand.appendChild(tab);
        return tab;
    }

    var back = makeTab('page-turn-back', '← Previous page', -1);
    var next = makeTab('page-turn-next', 'Turn page →', 1);

    function updateTabs() {
        var room = sheets.scrollWidth - sheets.clientWidth;
        back.hidden = sheets.scrollLeft <= 4;
        next.hidden = sheets.scrollLeft >= room - 4;
    }

    sheets.addEventListener('scroll', updateTabs);
    window.addEventListener('resize', updateTabs);
    updateTabs();
}
