imagesLoading = 0;

function loadImage(link) {
    imagesLoading += 1;

    let image = new Image();
    image.src = link;

    image.onload = function() {
        imagesLoading -= 1;
    }

    return image;
}

images = {
    snake: {
        head: loadImage('images//snake//head.png'),
        tail: loadImage('images//snake//tail.png'),
        straight: loadImage('images//snake//straight.png'),
        corner: loadImage('images//snake//corner.png'),
    },
    food: {
        apple: loadImage('images//food//apple.png'),
    },
    backgrounds: {
        grass: loadImage('images//backgrounds//grass.png'),
    }
}