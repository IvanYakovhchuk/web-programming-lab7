const playButton = document.getElementById("play");
const animArea = document.getElementById("anim");
const controlsArea = document.getElementById("controls");
const closeButton = document.getElementById("close");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop")
const reloadButton = document.getElementById("reload");
const messageArea = document.getElementById("msg");
const workArea = document.querySelector('.work-area');
if (!workArea) {
    console.log("((")
}

let circle1, circle2;
let direction1 = [1, 1];
let direction2 = [-1, -1];
let speed1, speed2;
let animationId;

window.onload = () => {
    stopButton.style.display = 'none';
    reloadButton.style.display = 'none';
};

window.onclose = () => {
    localStorage.clear();
}

playButton.addEventListener('click', async () => {
    localStorage.clear();
    clearEvents();
    const listArea = document.querySelector('.list');
    workArea.innerHTML = '';
    workArea.appendChild(controlsArea);
    workArea.appendChild(animArea);
    listArea.innerHTML = '<ol><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li></ol>';
    messageArea.textContent = "Кнопка Play натиснута";
    logEvent("Кнопка Play натиснута");
    saveEventToLocalStorage("Кнопка Play натиснута (local storage)");
    animArea.style.display = 'block';
    controlsArea.style.display = 'flex';
    reloadButton.style.display = 'none';
    stopButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    animArea.innerHTML = '';
    animArea.appendChild(createCircle('circle1', 10, 'yellow'));
    animArea.appendChild(createCircle('circle2', 25, 'red'));
    console.log("button works")
});

closeButton.addEventListener('click', () => {
    if (animationId) {
        clearInterval(animationId);
    }
    logEvent("Кнопка Close натиснута");
    saveEventToLocalStorage("Кнопка Close натиснута (local storage)");
    sendAllEventsFromLocalStorageToServer();
    animArea.style.display = 'none';
    controlsArea.style.display = 'none';
});

startButton.addEventListener('click', () => {
    playButton.disabled = true;
    messageArea.textContent = "Кнопка Start натиснута";
    logEvent("Кнопка Start натиснута");
    saveEventToLocalStorage("Кнопка Start натиснута (local storage)");
    startButton.style.display = 'none';
    reloadButton.style.display = 'none';
    stopButton.style.display = 'inline-block';

    if (!speed1 || !speed2) {
        speed1 = Math.random() * 3 + 5;
        speed2 = Math.random() * 3 + 5;
    }

    circle1 = document.getElementById('circle1');
    circle2 = document.getElementById('circle2');

    animationId = setInterval(() => {
        moveCircle(circle1, speed1, direction1);
        moveCircle(circle2, speed2, direction2);

        if (isOverlapping(circle1, circle2)) {
            messageArea.textContent = "Менший круг накладений на більший - анімація зупинена";
            logEvent("Менший круг накладений на більший - анімація зупинена");
            saveEventToLocalStorage("Менший круг накладений на більший - анімація зупинена (local storage)");
            startButton.style.display = 'none';
            stopButton.style.display = 'none';
            reloadButton.style.display = 'inline-block';
            stopAnimation();
            playButton.disabled = false;
        }

    }, 20);
});

stopButton.addEventListener('click', () => {
    messageArea.textContent = "Кнопка Stop натиснута";
    logEvent("Кнопка Stop натиснута");
    saveEventToLocalStorage("Кнопка Stop натиснута (local storage)");
    stopButton.style.display = 'none';
    reloadButton.style.display = 'none';
    startButton.style.display = 'inline-block';

    stopAnimation();
});

reloadButton.addEventListener('click', async () => {
    messageArea.textContent = "Кнопка Reload натиснута";
    logEvent("Кнопка Reload натиснута");
    saveEventToLocalStorage("Кнопка Reload натиснута (local storage)");
    await sendAllEventsFromLocalStorageToServer();
    await clearEvents();
    workArea.innerHTML = '';
    workArea.appendChild(controlsArea);
    workArea.appendChild(animArea);
    reloadButton.style.display = 'none';
    stopButton.style.display = 'none';
    startButton.style.display = 'inline-block';

    animArea.innerHTML = '';
    animArea.appendChild(createCircle('circle1', 10, 'yellow'));
    animArea.appendChild(createCircle('circle2', 25, 'red'));

    direction1 = [1, 1];
    direction2 = [-1, -1];
    speed1 = Math.random() * 3 + 5;
    speed2 = Math.random() * 3 + 5;
});

function createCircle(id, radius, color) {
    const circle = document.createElement('div');
    circle.id = id;
    circle.classList.add('circle');
    circle.style.width = `${radius * 2}px`;
    circle.style.height = `${radius * 2}px`;
    circle.style.backgroundColor = color;

    if (id === 'circle1') {
        circle.style.left = '0px';
        circle.style.top = 'calc(50% - 5px)';
    } else {
        circle.style.left = 'calc(50% - 12.5px)';
        circle.style.top = '0px';
    }

    return circle;
}

let lastLeftChangeCircle1 = 0;
let lastTopChangeCircle2 = 0;

function moveCircle(circle, speed, direction) {
    const animRect = animArea.getBoundingClientRect();
    const currentLeft = parseFloat(circle.style.left) || 0;
    const currentTop = parseFloat(circle.style.top) || 0;

    if (circle.id === 'circle1') {
        let newLeft = currentLeft + speed * direction[0];

        if (Math.abs(newLeft - lastLeftChangeCircle1) >= 20) {
            messageArea.textContent = `Жовтий круг змістився на 20 пікселів по горизонталі, нова позиція: ${newLeft.toFixed(2)}px`;
            logEvent("Жовтий круг змістився на 20 пікселів по горизонталі");
            saveEventToLocalStorage("Жовтий круг змістився на 20 пікселів по горизонталі (local storage)");
            lastLeftChangeCircle1 = newLeft;
        }

        if (newLeft <= 0) {
            messageArea.textContent = "Жовтий круг доторкнувся до стінки, новий напрямок руху - праворуч";
            logEvent("Жовтий круг доторкнувся до стінки, новий напрямок руху - праворуч");
            saveEventToLocalStorage("Жовтий круг доторкнувся до стінки, новий напрямок руху - праворуч (local storage)");
            direction[0] = 1;
        } else if (newLeft + circle.offsetWidth >= animRect.width) {
            messageArea.textContent = "Жовтий круг доторкнувся до стінки, новий напрямок руху - ліворуч";
            logEvent("Жовтий круг доторкнувся до стінки, новий напрямок руху - ліворуч");
            saveEventToLocalStorage("Жовтий круг доторкнувся до стінки, новий напрямок руху - ліворуч (local storage)");
            direction[0] = -1;
        }

        circle.style.left = `${Math.max(0, Math.min(newLeft, animRect.width - circle.offsetWidth))}px`;
    }

    if (circle.id === 'circle2') {
        let newTop = currentTop + speed * direction[1];

        if (Math.abs(newTop - lastTopChangeCircle2) >= 50) {
            messageArea.textContent = `Червоний круг змістився на 50 пікселів по вертикалі, нова позиція: ${newTop.toFixed(2)}px`;
            logEvent("Червоний круг змістився на 50 пікселів по вертикалі");
            saveEventToLocalStorage("Червоний круг змістився на 50 пікселів по вертикалі (local storage)");
            lastTopChangeCircle2 = newTop;
        }

        if (newTop <= 0) {
            messageArea.textContent = "Червоний круг доторкнувся до стінки, новий напрямок руху - вниз";
            logEvent("Червоний круг доторкнувся до стінки, новий напрямок руху - вниз");
            saveEventToLocalStorage("Червоний круг доторкнувся до стінки, новий напрямок руху - вниз (local storage)");
            direction[1] = 1;
        } else if (newTop + circle.offsetHeight >= animRect.height) {
            messageArea.textContent = "Червоний круг доторкнувся до стінки, новий напрямок руху - вверх";
            logEvent("Червоний круг доторкнувся до стінки, новий напрямок руху - вверх");
            saveEventToLocalStorage("Червоний круг доторкнувся до стінки, новий напрямок руху - вверх (local storage)");
            direction[1] = -1;
        }

        circle.style.top = `${Math.max(0, Math.min(newTop, animRect.height - circle.offsetHeight))}px`;
    }
}


function isOverlapping(circle1, circle2) {
    const rect1 = circle1.getBoundingClientRect();
    const rect2 = circle2.getBoundingClientRect();
  
    const radius1 = rect1.width / 2;
    const radius2 = rect2.width / 2;
  
    const centerX1 = rect1.left + radius1;
    const centerY1 = rect1.top + radius1;
    const centerX2 = rect2.left + radius2;
    const centerY2 = rect2.top + radius2;

    const distance = Math.sqrt(Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2));
    
    if (distance + Math.min(radius1, radius2) <= Math.max(radius1, radius2)) {
        return true;
    }

    return false;
}

function stopAnimation() {
    clearInterval(animationId);
}

async function saveEventToLocalStorage(eventMessage) {
    const eventTime = new Date().toISOString();
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push({
        event: eventMessage,
        time: eventTime
    });
    localStorage.setItem('events', JSON.stringify(events));
}

async function sendAllEventsFromLocalStorageToServer() {
    playButton.disabled = true;
    const events = JSON.parse(localStorage.getItem('events')) || [];

    workArea.innerHTML = '<p>Зачекайте, будь ласка, дані оновлюються...</p>';
    await new Promise(resolve => setTimeout(resolve, 0));

    for (let event of events) {
        await sendEventFromLocalStorageToServer(event);
    }
    
    await waitForServerToFinishProcessing();
    await loadEventsFromServer();
    
    workArea.innerHTML = '<p>Дані завантажено!</p>';
    playButton.disabled = false;
}

async function sendEventFromLocalStorageToServer(eventData) {
    const eventTime = new Date().toISOString();
    try {
        await fetch('http://localhost:8080/log-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventData.event,
                time: eventTime
            })
        });
    } catch (error) {
        console.error('Error sending event to server:', error);
    }
}

async function waitForServerToFinishProcessing() {
    while (true) {
        const response = await fetch('http://localhost:8080/check-processing-status');
        const isProcessing = await response.json();
        
        if (!isProcessing) {
            break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function loadEventsFromServer() {
    try {
        const response = await fetch('http://localhost:8080/load-events', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            }
        });
        const events = await response.json();
        console.log(events);

        const listArea = document.querySelector('.list');
        listArea.innerHTML = '';

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const idHeader = document.createElement('th');
        idHeader.textContent = 'ID';
        idHeader.style.border = '1px solid #ddd';
        idHeader.style.padding = '8px';

        const eventHeader = document.createElement('th');
        eventHeader.textContent = 'Подія';
        eventHeader.style.border = '1px solid #ddd';
        eventHeader.style.padding = '8px';

        const timeHeader = document.createElement('th');
        timeHeader.textContent = 'Час';
        timeHeader.style.border = '1px solid #ddd';
        timeHeader.style.padding = '8px';

        headerRow.appendChild(idHeader);
        headerRow.appendChild(eventHeader);
        headerRow.appendChild(timeHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        events.forEach(event => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = event.id;
            idCell.style.border = '1px solid #ddd';
            idCell.style.padding = '8px';

            const eventCell = document.createElement('td');
            eventCell.textContent = event.event;
            eventCell.style.border = '1px solid #ddd';
            eventCell.style.padding = '8px';

            const timeCell = document.createElement('td');
            timeCell.textContent = new Date(event.time).toLocaleString();
            timeCell.style.border = '1px solid #ddd';
            timeCell.style.padding = '8px';

            row.appendChild(idCell);
            row.appendChild(eventCell);
            row.appendChild(timeCell);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        listArea.appendChild(table);
    } catch (error) {
        console.error('Error loading events from server:', error);
    }
}

async function clearEvents() {
    try {
        await fetch('http://localhost:8080/clear-events', {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error clearing events from the database:', error);
    }
}

let isRequestInProgress = false;
let eventQueue = [];

function logEvent(eventMessage) {
    const eventData = { event: eventMessage };
    eventQueue.push(eventData);

    if (!isRequestInProgress) {
        processQueue();
    }
}

function processQueue() {
    if (eventQueue.length === 0) {
        return;
    }
    isRequestInProgress = true;
    const eventData = eventQueue.shift();

    fetch('http://localhost:8080/log-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event: eventData.event,
            time: new Date().toISOString()
        })
    })
    .then(() => {
        console.log("Подія успішно надіслана на сервер.");
    })
    .catch(error => {
        console.error("Помилка при відправленні події:", error);
    })
    .finally(() => {
        isRequestInProgress = false;
        processQueue();
    });
}