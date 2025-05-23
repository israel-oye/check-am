'use strict;'
const search = document.querySelector('.search-box');
const resultBox = document.querySelector('.result');
const spinIcon = document.querySelector('i.fa-spinner');
const resultCard = document.querySelector('.result-card');
const resultCardImg = document.querySelector('.result-card img');
const resultCardNetwork = document.querySelector('.result-card h3.network');
const errorBox = document.getElementsByClassName('error-message')[0];
const tweetModal = document.querySelector('.modal');
const aboutModal = document.querySelector('.about-modal');
const closeBtns = document.querySelectorAll('button.close');
const infoNav = document.querySelector('nav .info');
const brandNav = document.querySelector('nav .brand');
const toolTip = document.getElementsByClassName('tooltip')[0];


const nigeriaNetworkData = {
    '9mobile': {
        name: "9Mobile Nigeria",
        prefixes: ["0809", "0817", "0818", "0908", "0909"]
    },
    'airtel': {
        name: "Airtel Nigeria",
        prefixes: ["0701", "0708", "0802", "0808", "0812", "0901", "0902", "0904", "0907", "0912"]
    },
    'glo': {
        name: "GLO Nigeria",
        prefixes: ["0705", "0805", "0807", "0811", "0815", "0905", "0915"]
    },
    'mtn': {
        name: "MTN Nigeria",
        prefixes: ["0703", "0704", "0706", "0803", "0806", "0810", "0813", "0814", "0816", "0903", "0906", "0913", "0916"]
    },
    'multilinks': {
        name: "Multilinks Nigeria",
        prefixes: ["07027", "0709"]
    },
    'ntel': {
        name: "NTEL Nigeria",
        prefixes: ["0804"]
    },
    'smile': {
        name: "Smile Nigeria",
        prefixes: ["0702"]
    },
    'starcomms': {
        name: "Starcomms Nigeria",
        prefixes: ["07028", "07029", "0819"]
    },
    'visafone': {
        name: "Visafone Nigeria",
        prefixes: ["07025", "07026"]
    },
};

const debounce = (func, delay) => {
    let timeOutId;
    return (...args) => {
        clearTimeout(timeOutId);
        timeOutId = setTimeout(func(...args), delay);
    }
}

const getNetwork = (inputPrefix) => {
    for (let network in nigeriaNetworkData) {
        const match = nigeriaNetworkData[network]['prefixes'].includes(inputPrefix);

        if (match) return network;
    }
}

const displayNetwork = (network) => {
    resultBox.style.backgroundImage = `url('/assets/images/${network}.png')`;

    setTimeout(() => {
        resultBox.classList.add('show');
    }, 500);
}

const showNetworkCard = (network) => {
    let src = `/assets/images/${network}.png`;
    let networkName = nigeriaNetworkData[network]['name'];

    resultCardImg.setAttribute('src', src);
    resultCardNetwork.textContent = networkName;
    resultCard.classList.add('show');
}

const showSpinner = (show) => {
    if (show) {
        spinIcon.classList.add('show');
    } else {
        spinIcon.classList.remove('show');
    }
};

const highlightSearchBox = notFound => {
    if (notFound) {
        search.classList.add('invalid');
    } else { search.classList.remove('invalid'); }
}

const clearDisplay = () => {
    resultBox.style.backgroundImage = '';
    setTimeout(() => {
        resultCard.classList.remove('show');
    }, 300);
    errorBox.classList.remove('fade-in');
    errorBox.innerText = '';
    highlightSearchBox(false);
};


const toggleModal = (modal, show) => {
    if (show) {
        modal.classList.remove('hide');
        modal.classList.remove('hidden');
        modal.classList.add('show');
    } else {
        modal.classList.remove('show');
        modal.classList.add('hide');

        const handleAnimationEnd = (e) => {
            if (e.animationName === 'pop-down') {
                modal.classList.remove('hide');
                modal.classList.add('hidden');
            }
        };

        modal.addEventListener('animationend', handleAnimationEnd, { once: true });
    }

}


search.addEventListener('input', debounce((e) => {
    search.value = search.value.replace(/[^0-9]/g, '');

    let inputTelNo = search.value;

    if (inputTelNo.length === 0) {
        showSpinner(false);
        clearDisplay();
    } else if (inputTelNo.length <= 3) {
        showSpinner(true);
        clearDisplay();
    } else {
        showSpinner(false);
        !inputTelNo.startsWith('0') ? inputTelNo = '0' + inputTelNo : inputTelNo;

        let inputPrefix = inputTelNo.slice(0, 4);
        let network = getNetwork(inputPrefix);
        displayNetwork(network ? network : 'not-found-icon');

        if (network && inputTelNo.length === 11) {
            showNetworkCard(network);
        } else if (!network && inputTelNo.length === 11) {
            highlightSearchBox(true);
            errorBox.classList.add('fade-in');
            errorBox.innerText = 'No match found';
        }
    }

}, 300)
);

toolTip.addEventListener('click', function (e) {
    this.classList.toggle('show');
})

brandNav.addEventListener('click', (e) => {
    toggleModal(tweetModal, true);
})

infoNav.addEventListener('click', (e) => {
    toggleModal(aboutModal, true);
})

closeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let referrentModal = btn.parentElement.parentElement;
        toggleModal(referrentModal, false);
    })
});


window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        toggleModal(e.target, false);
    }
    else if (!e.target.classList.contains('tooltip')) {
        toolTip.classList.remove('show');
    }
})

const likeContainer = document.querySelector('.like-action');
const likeButton = document.querySelector('.like-action i');

likeButton.addEventListener('click', function (e) {
    this.classList.toggle('like');
})
