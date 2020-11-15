const createCell = (rect) => {
    const cell = document.createElement('div');
    cell.id = `my-element-handler`;
    cell.style.position = 'absolute';
    cell.style.border = 'solid';
    cell.style.width = rect.pageX - rect.x + 'px';
    cell.style.height = rect.pageY - rect.y + 'px';
    cell.style.left = rect.x + 'px';
    cell.style.top = rect.y + 'px';
    return cell;
};

const updateCell = (rect) => {
    console.log(rect);
    const cell = document.getElementById('my-element-handler');
    cell.style.width = rect.pageX - rect.x + 'px';
    cell.style.height = rect.pageY - rect.y + 'px';
    cell.style.top = rect.y + 'px';
    cell.style.left = rect.x + 'px';
    return cell;
};

var rect = {
    x: 0,
    y: 0,
    pageX: 100,
    pageY: 100,
};

const temp = document.getElementById('my-element-handler');
if (temp == null) document.body.appendChild(createCell(rect));

document.body.addEventListener('mousedown', (e) => {
    rect = { ...rect, x: e.pageX, y: e.pageY };
    updateCell({ x: 0, y: 0, pageX: 0, pageY: 0 });
});

document.body.addEventListener('mouseup', (e) => {
    rect = { ...rect, pageX: e.pageX, pageY: e.pageY };
    updateCell(rect);
    const body = {
        url: window.location.href,
        rect,
        browserSettings: {
            innerWidth: document.body.clientWidth,
            innerHeight: document.body.clientHeight,
            scrollTop: document.documentElement.scrollTop,
            scrollLeft: document.documentElement.scrollLeft,
        },
    };

    console.log(body);

    fetch('http://localhost:3000/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((response) => {})
        .catch();
});
