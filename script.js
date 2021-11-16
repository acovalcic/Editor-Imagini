'use strict';

const app = {
    visibleCanvas: null,
    offscreenCanvas: null,
    downloadLink: null,
    loader: null,
    currentEffect: null
}

/** 
 * @param {string} effect 
 */
app.changeEffect = function (effect) {
    if (effect !== app.currentEffect) {
        app.currentEffect = effect;
        app.drawImage();
    }
}

app.drawImage = function () {

    app.loader.style.display = 'block';

    let t0 = performance.now();
    console.log("t0: " + t0);

    let pContext = app.offscreenCanvas.getContext("2d");
    switch (app.currentEffect) {
        case "normal":
            app.normal(pContext);
            break;
        case "grayscale":
            app.grayscale(pContext);
            break;
        case "threshold":
            app.threshold(pContext);
            break;
        case "sepia":
            app.sepia(pContext);
            break;
        case "invert":
            app.invert(pContext);
            break;
        case "pixelate":
            app.pixelate(pContext);
            break;
        case "twoChannels":
            app.twoChannels(pContext);
            break;
        case "red":
            app.red(pContext);
            break;
        case "green":
            app.green(pContext);
            break;
        case "blue":
            app.blue(pContext);
            break;
    }

    let t1 = performance.now();
    console.log(t1 - t0 + ": drawing the image on the canvas");

    app.offscreenCanvas.toBlob(function (blob) {
        let blobUrl = URL.createObjectURL(blob);
        app.downloadLink.href = blobUrl;
    }, "image/png");

    app.loader.style.display = 'none';
}

app.normal = function (pContext) {

    pContext.drawImage(app.visibleCanvas, 0, 0);
}

app.grayscale = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");

    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4)
        pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

    pContext.putImageData(imageData, 0, 0);
}

app.threshold = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");

    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        data[i] = data[i + 1] = data[i + 2] = (v >= 100) ? 255 : 0;
    }

    pContext.putImageData(imageData, 0, 0);
}

app.sepia = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = Math.round((r * .393) + (g * .769) + (b * .189));
        data[i + 1] = Math.round((r * .349) + (g * .686) + (b * .168));
        data[i + 2] = Math.round((r * .272) + (g * .534) + (b * .131));
    }
    pContext.putImageData(imageData, 0, 0);
}

app.invert = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = 255 - r;
        data[i + 1] = 255 - g;
        data[i + 2] = 255 - b;
    }

    pContext.putImageData(imageData, 0, 0);
}

app.pixelate = function (pContext) {
    app.normal(pContext);
    let oContext = app.visibleCanvas.getContext("2d");
    const blocksize = 4;
    let image = document.getElementById("processedImage");

    let canvas2 = document.createElement("canvas");
    canvas2.width = oContext.canvas.width;
    canvas2.height = oContext.canvas.height;
    const context2 = canvas2.getContext("2d");
    context2.drawImage(image, 0, 0);

    for (var x = 0; x < oContext.canvas.width; x += blocksize) {
        for (var y = 0; y < oContext.canvas.height; y += blocksize) {
            var pixel = context2.getImageData(x, y, 1, 1);
            pContext.fillStyle = "rgb(" + pixel.data[0] + "," + pixel.data[1] + "," + pixel.data[2] + ")";
            pContext.fillRect(x, y, x + blocksize - 1, y + blocksize - 1);
        }

    }
}

app.twoChannels = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = g;
    }
    pContext.putImageData(imageData, 0, 0);
}

app.red = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = r;
        data[i + 1] = 0;
        data[i + 2] = 0;
    }
    pContext.putImageData(imageData, 0, 0);
}

app.green = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = 0;
        data[i + 1] = g;
        data[i + 2] = 0;
    }
    pContext.putImageData(imageData, 0, 0);
}


app.blue = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = b;
    }
    pContext.putImageData(imageData, 0, 0);
}

app.load = function () {
    app.visibleCanvas = document.createElement("canvas");
    app.downloadLink = document.getElementById("downloadLink");
    app.offscreenCanvas = document.getElementById("processedImage");
    app.loader = document.querySelector('.loader');

    app.registerSW();

    let buttons = document.getElementsByClassName("effectType");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () { app.changeEffect(this.dataset.effect) });
    }

    document.getElementById("fileBrowser").addEventListener("change", function (e) {
        let reader = new FileReader();
        reader.addEventListener('load', function (event) {

            let img = document.createElement("img");
            img.addEventListener("load", function () {
                app.visibleCanvas.width = app.offscreenCanvas.width = img.naturalWidth;
                app.visibleCanvas.height = app.offscreenCanvas.height = img.naturalHeight;

                const context = app.visibleCanvas.getContext("2d");
                context.drawImage(img, 0, 0);

                app.changeEffect("normal");
            });
            img.src = event.target.result;
        });
        reader.readAsDataURL(e.target.files[0]);
    });
}

app.registerSW = async function(){
    if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('sw.js');
        } catch (e) {
          console.log(`SW registration failed`);
        }
      }
}