// elements selected
const container = document.querySelector('.container');
const btn_mic = document.querySelector('.button--mic');
const input_1 = document.getElementById('input--1');
const word_def_ctr = document.querySelector('.word--def--ctr');
const word_syno_ctr = document.querySelector('.word--syno--ctr');
const word_anto_ctr = document.querySelector('.word--anto--ctr');
const def_list = document.querySelector('.def--list');
const syno_list = document.querySelector('.syno--list');
const anto_list = document.querySelector('.anto--list');
const input_data = document.querySelector('.input--data');
const btn_history = document.querySelector('.button--history');
const hist_ctr = document.querySelector('.history');
const hist_data = document.querySelector('.history--data');
const btn_delete = document.querySelector('.btn--delete');
const btn_audio = document.querySelector('.btn--audio');
const word_pos = document.querySelector('.word--pos');
const btn_hide = document.querySelector('.btn--hide');
const img_ctr = document.querySelector('.img--ctr');
const related_img = document.querySelector('.related--images');
const spinner_element = `
    <div class="spin--container">
        <img src="spinner2.jpg" alt="...." class="spinner">
    </div>
`;
const related_image_html =  `
<div class="img--flex">
<h1 class="related-img">
            Related Images Based on Your Search
        </h1></div>
`;

const history_element = `<div class="history">
<div class="history--container">
    <div class="hide--history">
        <h3 class="history--head">History</h3>
        <button class="btn--hide">Hide</button>
    </div>
    <ul class="history--data">
        <!-- <div class="spinner">
<svg>
<use href="src/img/icons.svg#icon-loader"></use>
</svg>
</div> -->
    </ul>
</div>
</div>`;

let searched_from = 'search';
let current_word;

// const dictionary = new Typo('en_US');

// function correctSpelling(word) {
//   if (dictionary.check(word)) {
//     // The word is spelled correctly
//     return word;
//   } else {
//     // The word is misspelled, suggest a correction
//     const suggestions = dictionary.suggest(word);
//     if (suggestions.length > 0) {
//       // Return the first suggestion
//       return suggestions[0];
//     } else {
//       // No suggestions found, return the original word
//       return word;
//     }
//   }
// }



// import { correct } from "./speelchecker";

// input_1.value='hello.'
// console.log(new String(input_1.value).toLowerCase().slice(0,-1));

let history_search = [];
if (localStorage.getItem('words') === null) {
    localStorage.setItem('words', JSON.stringify(history_search));
}
else {
    history_search = JSON.parse(localStorage.getItem('words'));
}

const wordSearch = async (query) => {
    // console.log(data.name);
    def_list.innerText = '';
    syno_list.innerText = '';
    anto_list.innerText = '';
    word_pos.innerText = '';
    if(query === '') return;
    def_list.insertAdjacentHTML('beforeend',spinner_element);
    syno_list.insertAdjacentHTML('beforeend',spinner_element);
    anto_list.insertAdjacentHTML('beforeend',spinner_element);
    document.querySelectorAll('.input--data').forEach(el => {
        el.innerText = `(${query})`;
    })
    console.log('query=>' + query);
    let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
    // let data2 = await fetch(`https://seller.flipkart.com/products`);
    // data2= data.json();
    data = await data.json();
    data = await data;
    // console.log(data2);

    // image api
    let data_image = await fetch(`https://pixabay.com/api/?key=35613608-b1975027d3434275325f55c58&q=${query}&image_type=photo`)
	data_image =  await data_image.json();
    console.log(data_image);

    // mongo api
    // let data_mongo = await fetch('https://ap-south-1.aws.data.mongodb-api.com/app/data-hsvng/endpoint/data/v1');
    // data_mongo = await data_mongo.json();
    // console.log(data_mongo)

    console.log(data[0]);
    if (searched_from === 'search') {
        history_search.push(query);
        render_history()
    }
    def_list.insertAdjacentHTML('beforeend',spinner_element);
    syno_list.insertAdjacentHTML('beforeend',spinner_element);
    anto_list.insertAdjacentHTML('beforeend',spinner_element);
    localStorage.setItem('words', JSON.stringify(history_search));
    // setTimeout(()=>{
        render(data[0]);
        render_img(data_image);
    // },2000);
}

// wordSearch(new String(input_1.value).toLowerCase().slice(1));

const render = (data) => {
    current_word = null;
    btn_audio.classList.remove('transparent');
    data.phonetics.forEach(el => {
        if (el.audio != '') {
            current_word = new Audio(el.audio);
        }
    })
    console.log(current_word);
    def_list.innerText = '';
    syno_list.innerText = '';
    anto_list.innerText = '';
    // console.log(meanings.length)
    word_pos.innerText = `PartOfSpeech : ${data.meanings[data.meanings.length - 1].partOfSpeech}`;
    data.meanings.forEach(element => {
        element.definitions.forEach((def, index) => {
            let list = document.createElement('li');
            if (index % 2 === 0) {
                list.classList.add('grey');
            }
            else list.classList.add('white');
            list.innerText = def.definition;
            def_list.insertAdjacentElement('beforeend', list); // adds element at first place
        })

        element.synonyms.forEach((syno, index) => {
            let list = document.createElement('li');
            if (index % 2 === 0) {
                list.classList.add('grey');
            }
            else list.classList.add('white');
            list.innerText = syno;

            syno_list.insertAdjacentElement('beforeend', list);
        })


        element.antonyms.forEach((anto, index) => {
            let list = document.createElement('li');
            if (index % 2 === 0) {
                list.classList.add('grey');
            }
            else list.classList.add('white');
            list.innerText = anto;
            anto_list.insertAdjacentElement('beforeend', list);
        })
    });
}

const render_img = (data_image)=>{
    img_ctr.innerHTML = '';
    related_img.innerHTML = '';
    related_img.insertAdjacentHTML('beforeend',related_image_html);
    // console.log('hello'+{data_image})
    console.log('hi');
    data_image.hits.forEach(el=>{
        let img_ = document.createElement('img');
        img_.setAttribute('src',el.webformatURL);
        img_.classList.add('img--about');
        img_ctr.insertAdjacentElement('afterbegin',img_);
    })
}

const render_history = () => {
    hist_data.innerText = '';
    if(history_search.length===0){
        let h3 = document.createElement('h3');
        h3.classList.add('no--history');
        h3.innerText = 'No History';
        hist_data.insertAdjacentElement('beforeend',h3);
    }
    history_search.forEach((el, i) => {
        let divelement = document.createElement('div');
        let list = document.createElement('li');
        let button = document.createElement('button');
        button.style.value = i;
        divelement.classList.add('hist--ctr--div');
        button.classList.add('btn--delete');
        // button.classList.add('btn');
        button.innerText = 'Delete';
        divelement.classList.add('slow-transition')
        button.style.value = i;
        divelement.appendChild(list);
        divelement.appendChild(button);
        list.style.value = 'history';
        list.innerText = el;
        if (i % 2 === 0) {
            divelement.classList.add('grey');
        }
        else divelement.classList.add('white');
        hist_data.insertAdjacentElement('beforeend', divelement);

    })
}

btn_audio.addEventListener('click', () => {
    current_word.play();
})








//...................................................................................
// Check if the Web Speech API is available in the current browser
// if ('webkitSpeechRecognition' in window) {
//     // Create a new instance of the speech recognition object
//     console.log('yes')
//     const recognition = new webkitSpeechRecognition();

//     // Set the language for recognition (e.g., 'en-US' for English in the United States)
//     recognition.lang = 'en-US';

//     // Start the recognition process
//     recognition.start();

//     // Add an event listener for when speech is recognized
//     recognition.addEventListener('result', (event) => {
//       // Get the recognized text from the event
//       let transcript = event.results[0][0].transcript;

//       // Display the recognized text
//     //   console.log(`You said: ${transcript}`);
//     });

//     // Add an event listener for when the recognition process ends
//     recognition.addEventListener('end', () => {
//       // Restart the recognition process after a short delay
//       setTimeout(() => {
//         recognition.start();
//       }, 1000);
//     });
//   } else {
//     // Web Speech API is not supported
//     console.log('Speech recognition is not supported in this browser.');
//   }
// .....................................................................................

const speechRecog = () => {
    if ('webkitSpeechRecognition' in window) {
        // Create a new instance of the speech recognition object
        console.log('yes')
        const recognition = new webkitSpeechRecognition();

        // Set the language for recognition (e.g., 'en-US' for English in the United States)
        recognition.lang = 'en-US';

        // Start the recognition process
        recognition.start();

        // Add an event listener for when speech is recognized
        recognition.addEventListener('result', (event) => {
            // Get the recognized text from the event
            let transcript = event.results[0][0].transcript;

            // Display the recognized text
            console.log(`You said: ${transcript}`);
            input_1.value = transcript;


            //searching the word........
            wordSearch(new String(input_1.value).toLowerCase().slice(0, -1));
            // console.log(new String(input_1.value).toLowerCase().slice(1))
        });

        // Add an event listener for when the recognition process ends
        // recognition.addEventListener('end', () => {
        //   // Restart the recognition process after a short delay
        //   recognition.start();
        // });
    } else {
        // Web Speech API is not supported
        // console.log('Speech recognition is not supported in this browser.');
        input_1.value = 'Speech recognition is not supported';
    }
}

btn_mic.addEventListener('click', (e) => {
    searched_from = 'search';
    // input_1.value = correctspelling(input_1.value);
    wordSearch(input_1.value);
})

btn_history.addEventListener('click', () => {
    hist_ctr.classList.toggle('translate--history');
    // hist_ctr.classList.toggle('translate--history--again');
    render_history();
})

btn_hide.addEventListener('click', () => {
    hist_ctr.classList.toggle('translate--history');
})

hist_data.addEventListener('click', (e) => {
    // console.log(e.target);
    if (e.target.style.value == 'history') {
        searched_from = 'history';
        input_1.value= e.target.innerText;
        wordSearch(e.target.innerText);
    }
    else {
        // console.log(e.target);
        let index = (e.target.style.value);
        console.log(index)
        history_search.splice(index, 1);
        // console.log(e.target.value)
        localStorage.setItem('words', JSON.stringify(history_search));
        console.log(history_search)
        render_history();
    }

})

// document.addEventListener('click',()=>{
//     hist_ctr.classList.remove('translate--history');
// })

// conversion of english to hindi

// Load the pre-trained model
// const MODEL_URL = 'https://storage.googleapis.com/tfjs-models/tfjs/translation_en_hi_v1/model.json';
// const MAX_LENGTH = 30;

// async function loadModel() {
//   const model = await tf.loadLayersModel(MODEL_URL);
//   const encoderModel = tf.model({inputs: model.inputs.slice(0, 1), outputs: model.layers[0].output});
//   const decoderModel = tf.model({inputs: [model.inputs[1], model.inputs[2], model.layers[0].output], outputs: model.outputs[0]});
//   return {model, encoderModel, decoderModel};
// }

// Convert English to Hindi
// async function translate(inputText) {
//   const {model, encoderModel, decoderModel} = await loadModel();

//   const inputSequence = tokenizer.textsToSequences([inputText])[0];
//   const inputTensor = tf.pad(tf.tensor2d([inputSequence], [1, inputSequence.length]), [[0, 0], [0, MAX_LENGTH - inputSequence.length]]);

//   let states = encoderModel.predict(inputTensor);

//   let targetSequence = tf.tensor2d([tokenizer.wordIndex['<start>']], [1, 1]);
//   let outputSequence = '';

//   while (outputSequence === '' || outputSequence.charAt(outputSequence.length - 1) !== '<end>' && outputSequence.length < MAX_LENGTH) {
//     const decoderOutput = decoderModel.predict([targetSequence, states[0], states[1]]);
//     const outputIndex = decoderOutput.argMax(axis=-1).dataSync()[0];
//     outputSequence += tokenizer.indexWord[outputIndex] + ' ';
//     targetSequence = tf.tensor2d([outputIndex], [1, 1]);

//     states = [decoderOutput.states[0], decoderOutput.states[1]];
//   }

//   return await outputSequence.trim().replace(/<start>/g, '').replace(/<end>/g, '');
// }

// // Example usage
// const inputText = 'Where are you going';
// const outputText =  translate(inputText);
// console.log(outputText); // Output: नमस्ते, आप कैसे हैं?


// console.log(correct('helllo'))


const database = async ()=>{
    let data = await fetch('/json');
    console.log(data);
}
// database();
