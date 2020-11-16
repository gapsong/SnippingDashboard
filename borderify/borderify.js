var isHover = false;

const createviewport = (rect) => {
    const viewport = document.createElement('div');
    viewport.id = `custom-viewport`;
    viewport.style.position = 'absolute';
    viewport.style.border = 'solid';
    viewport.style.width = rect.pageX - rect.x + 'px';
    viewport.style.height = rect.pageY - rect.y + 'px';
    viewport.style.left = rect.x + 'px';
    viewport.style.top = rect.y + 'px';
    viewport.style.zIndex = '500';

    viewport.addEventListener('mouseover', mouseOver);
    viewport.addEventListener('mouseout', mouseOut);

    function mouseOver() {
        isHover = true;
    }

    function mouseOut() {
        isHover = false;
    }

    return viewport;
};

const updateviewport = (rect) => {
    const viewport = document.getElementById('custom-viewport');
    viewport.style.width = rect.pageX - rect.x + 'px';
    viewport.style.height = rect.pageY - rect.y + 'px';
    viewport.style.top = rect.y + 'px';
    viewport.style.left = rect.x + 'px';
    return viewport;
};

var rect = {
    x: 0,
    y: 0,
    pageX: 100,
    pageY: 100,
};

const createMenu = () => {
    const button = document.createElement('input');
    button.id = 'start-button';
    button.type = 'button';
    button.value = 'text';
    button.style.position = 'absolute';
    button.style.left = '0px';
    button.style.top = '0px';
    button.style.zIndex = '500';
    button.addEventListener('click', function () {
        document.documentElement.style.cursor = 'crosshair';
    });
    return button;
};

const init = () => {
    document.body.appendChild(createMenu());

    const temp = document.getElementById('my-element-handler');
    if (temp == null) {
        document.body.appendChild(createviewport(rect));
    }
};

document.body.addEventListener('mousedown', (e) => {
    if (!isHover) {
        rect = { ...rect, x: e.pageX, y: e.pageY };
        updateviewport({ x: 0, y: 0, pageX: 0, pageY: 0 });
    }
});

document.body.addEventListener('mouseup', (e) => {
    if (!isHover) {
        rect = { ...rect, pageX: e.pageX, pageY: e.pageY };
        updateviewport(rect);
        const body = {
            url: window.location.href,
            rect,
            browserSettings: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                scrollTop: document.documentElement.scrollTop,
                scrollLeft: document.documentElement.scrollLeft,
            },
        };

        postViewport(body);
    }
});

const postViewport = (body) =>
    fetch('http://localhost:3000/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

init();

// Make the DIV element draggable:
dragElement(document.getElementById('custom-viewport'));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + 'header')) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
