
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');

let initialColors;



sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);
});


colorDivs.forEach((div, index) => {
    div.addEventListener('change',  function() {
        updateTextUI(index);
    });
});


///color generator
function generateHex() {

    const hexColor = chroma.random();
    return hexColor;

}

function randomColors() {
    initialColors = [];
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();
        initialColors.push(chroma(randomColor).hex());
        div.style.background = randomColor;
        hexText.innerText = randomColor;
        checkTextContrast(randomColor, hexText);

        const color = randomColor;
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];


        colorizeSliders(color, hue, brightness, saturation);

    });
    resetInputs();
}

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) 
        text.style.color = 'black';
    else 
        text.style.color = 'white';
    
}

function colorizeSliders(color, hue, brightness, saturation) {
    
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);

    const scaleSat = chroma.scale([noSat, color, fullSat]);

    const midBright = color.set('hsl.l', .5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);

    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)},  ${scaleSat(1)})` ;
    
    brightness.style.backgroundImage =`linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(.5)}, ${scaleBright(1)})`;

    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;

}
function hslControls(e) {
    const index = e.target.getAttribute('data-bright') ||
        e.target.getAttribute('data-sat') ||
        e.target.getAttribute('data-hue');
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0].value; 
    const brightness = sliders[1].value;
    const saturation = sliders[2].value;

    const bgColor = initialColors[index];
    
    let color = chroma(bgColor)
        .set('hsl.s', saturation)
        .set('hsl.l', brightness)
        .set('hsl.h', hue);
    colorDivs[index].style.backgroundColor = color;
    colorizeSliders(color, sliders[0], sliders[1], sliders[2]);
   


}

function updateTextUI(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button');
    textHex.innerText = color.hex();

    checkTextContrast(color, textHex);
    for (icon of icons) 
        checkTextContrast(color, icon);

}


function resetInputs() {
    const sliders = document.querySelectorAll('.sliders input');
    sliders.forEach(slider => { 
        
        if (slider.name === 'hue') {
            const hueColor = initialColors[slider.getAttribute("data-hue")];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = hueValue;
        }

        if (slider.name === 'brightness') {
            const brightColor = initialColors[slider.getAttribute("data-bright")];
            const brightValue = (chroma(brightColor).hsl()[2]*100)/100;
            slider.value = brightValue;
        }

        if (slider.name === 'saturation') {
            const satColor = initialColors[slider.getAttribute("data-sat")];
            const satValue = (chroma(satColor).hsl()[1] *100)/100;
            slider.value = satValue;
        }
    })
}

randomColors();
