document.addEventListener('DOMContentLoaded', function () {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../html/header.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            headerPlaceholder.innerHTML = xhr.responseText;
        }
    };
    xhr.send();
});