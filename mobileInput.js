let mobile = false;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    mobile = true;
};

if (mobile) {
    canvas.addEventListener("touchstart", getMobileInput, false);
};

let mobileButtons = [{ direction: 'up', rect: { x: 0.9, y: 0, width: 1.2, height: 1 } },
{ direction: 'left', rect: { x: 0, y: 0, width: 0.9, height: 2 } },
{ direction: 'right', rect: { x: 2.1, y: 0, width: 0.9, height: 2 } },
{ direction: 'down', rect: { x: 0.9, y: 1, width: 1.2, height: 1 } }];

let buttonSize = new Size(canvas.width / 3, canvas.height / 2);

function getMobileInput(e) {
    let scaledMousePos = { x: e.touches[0].clientX / buttonSize.width, y: e.touches[0].clientY / buttonSize.height }
    let scaledMouseRect = new Rect(scaledMousePos.x, scaledMousePos.y, 0, 0);

    let direction;
    for (button of mobileButtons) {
        if (touching(button.rect, scaledMouseRect)) {
            direction = button.direction;
            break;
        }
    }
    if (direction) {
        if (!badInput(direction)) {
            lastKey = direction;
        }
    }
};

function showArrows() {
    if (mobile) {

        buttonSize = new Size(canvas.width / 3, canvas.height / 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';

        for (let button of mobileButtons) {
            let margin = 4;
            ctx.fillRect(button.rect.x * buttonSize.width + margin,
                button.rect.y * buttonSize.height + margin,
                button.rect.width * buttonSize.width - margin * 2,
                button.rect.height * buttonSize.height - margin * 2);
        }
    }
};