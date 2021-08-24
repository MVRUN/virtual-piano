const body = document.querySelector('.body');
const piano = document.querySelector('.piano');
const pianoKey = document.querySelectorAll('.piano-key');
const btnContainer = document.querySelector('.btn-container');
const btnSwitch = document.querySelectorAll('.btn');
const fullScreenBtn = document.querySelector('.fullscreen')
let audio;

//////////////////Отработка по нажатию клавиш////////////////////////////////////
//функция воспроизведения звука и смены состояния клавиши
const startAudio = (event) => {
    event.target.classList.add("piano-key-active");//изменение внешнего вида клавиши
    audio = new Audio(`assets/audio/${event.target.getAttribute('data-note')}.mp3`);
    audio.play();
}
//функция остановки воспроизведения звука и возврат клавиши в исходное состояние
const stopAudio = (event) => {
    event.target.classList.remove("piano-key-active");// возврат внешнего вида клавиши в исходное состояние
}
//функция запуска события при зажатой кнопки мыши
const keyDown = (event) => {
    if (event.target.classList.contains("piano-key")) {
        startAudio(event);
        
    }
    pianoKey.forEach((elem) => {
        elem.addEventListener("mouseover", startAudio);//старт события аудио и изменения внешнего вида клавиши при зажатой кнопки мыши
        elem.addEventListener("mouseout", stopAudio);//старт события остановки аудио и возврат внешнего вида клавиши в исходное состояние при переводе мыши на другой объект
    });

}
//функция запуска события и отпуске кнопки мыши
const keyUp = () => {
    pianoKey.forEach((elem) => {
        elem.classList.remove("piano-key-active");//возврат всех клавиш в исходное состояние
        elem.removeEventListener("mouseover", startAudio);//удаление обработчика событий при зажатой кнопки мыши над элементом
        elem.removeEventListener("mouseout", stopAudio);//удаление обработчика событий при переводе зажатой кнопки мыши на другой элемент
    });
}

piano.addEventListener("mousedown", keyDown, false);//обработчик при нажатии кнопки мыши
body.addEventListener("mouseup", keyUp);//обработчик при отпуске кнопки мыши

//////////////// Отработка смены режимов клавиш(notes/letter)/////////////////////////////////////
const toggleBtnMode = (event) => {
    if(!event.target.classList.contains("btn-active")) {
        btnSwitch.forEach((elem) => {
            if (elem.classList.contains("btn-active")){
                elem.classList.remove("btn-active");
                event.target.classList.add("btn-active")
            }
        });
        pianoKey.forEach((elem) => {
            elem.classList.toggle("letter");
            });
    }
    
} 

btnContainer.addEventListener("click", toggleBtnMode);//обработчик для смены режима note-letter по клику

/////////////////////////Отработка по нажатию кнопок клавиатуры////////////////////////////////////
const playAudioLetter = (event) => {

    if(event.repeat === false) {
        pianoKey.forEach(elem => {
            if(event.code.slice(-1) === elem.getAttribute('data-letter')) {
                audio = new Audio(`assets/audio/${elem.getAttribute('data-note')}.mp3`);
                elem.classList.add("piano-key-active-letter");
                audio.play();
                }
                
        })
    }
}
const stopAudioLetter = (event) => {
    pianoKey.forEach(elem => {
        if(event.code.slice(-1) === elem.getAttribute('data-letter')) {
            elem.classList.remove("piano-key-active-letter");
        }
    })
}
window.addEventListener("keydown", playAudioLetter);// обработчик при нажатии клавиши клавиатуры
window.addEventListener("keyup", stopAudioLetter);// обработчик при отпуске клавиши клавиатуры

////////////////////////////Отработка полноэкранного режима/////////////////////////////////////////
//Функция смены полноэкранного режима и стиля кнопки
const toggleFullScreen = (event) => {
    if (document.fullscreenElement === null) {
        event.target.classList.add('openfullscreen');
        document.documentElement.requestFullscreen();
    }
    else {
        event.target.classList.remove('openfullscreen');
        document.exitFullscreen();
    }
}

fullScreenBtn.addEventListener('click', toggleFullScreen);
const domain1 = "http://127.0.0.1:5500";
function listener(event) {
  if (event.origin.startsWith(domain1)) { 
    let payload = JSON.parse(event.data);
    switch(payload.method) {
        case 'set':
            localStorage.setItem(payload.key, JSON.stringify(payload.data));
            console.log('Data added')
            console.log(JSON.stringify(payload.callback))
            break;
        case 'get':
            var parent = window.parent;
            var data = localStorage.getItem(payload.key);
            //parent.postMessage(data, domain1);
            parent.postMessage(callback, domain1);
            console.log('Data sent')
            break;
        case 'remove':
            localStorage.removeItem(payload.key);
             console.log('Data deleted')
            break;
    }
    } else {
         console.log('Failed to receive data');
        return; 
    } 
}

if (window.addEventListener) {
  window.addEventListener("message", listener)
}
function callback() {
    console.log("Колбек выполненf")
     
}









