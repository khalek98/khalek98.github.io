/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/calc.js":
/*!********************************!*\
  !*** ./src/js/modules/calc.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const calc = () => {
  const result = document.querySelector('.calculating__result span');
  let sex, weight, height, age, ratio;

  if (localStorage.getItem('sex')) {
    sex = localStorage.getItem('sex');
  } else {
    sex = 'female';
    localStorage.setItem('sex', 'female');
  }

  if (localStorage.getItem('ratio')) {
    ratio = localStorage.getItem('ratio');
  } else {
    ratio = 1.375;
    localStorage.setItem('ratio', 1.375);
  }

  function initLocalSettings(selector, activeClass) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(elem => {
      elem.classList.remove(activeClass);

      if (elem.getAttribute('id') === localStorage.getItem('sex')) {
        elem.classList.add(activeClass);
      }

      if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        elem.classList.add(activeClass);
      }
    });
  }

  initLocalSettings('#gender div', 'calculating__choose-item_active');
  initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

  function calcTotal() {
    if (!weight || !height || !age) {
      result.textContent = '____';
      return;
    }

    if (sex === 'female') {
      result.textContent = Math.round((447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio);
    } else {
      result.textContent = Math.round((88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio);
    }
  }

  calcTotal();

  function getStaticInformation(selector, activeClass) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(elem => {
      elem.addEventListener('click', e => {
        if (e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio');
          localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
        } else {
          sex = e.target.getAttribute('id');
          localStorage.setItem('sex', e.target.getAttribute('id'));
        }

        elements.forEach(elem => {
          elem.classList.remove(activeClass);
        });
        e.target.classList.add(activeClass);
        calcTotal();
      });
    });
  }

  getStaticInformation('#gender div', 'calculating__choose-item_active');
  getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

  function getDynamicInformation(selector) {
    const input = document.querySelector(selector);
    input.addEventListener('input', () => {
      if (input.value.match(/\D/g)) {
        input.style.border = '1px solid red';
      } else {
        input.style.border = 'none';
      }

      switch (input.getAttribute('id')) {
        case 'height':
          height = +input.value;
          break;

        case 'weight':
          weight = +input.value;
          break;

        case 'age':
          age = +input.value;
          break;
      }

      calcTotal();
    });
  }

  getDynamicInformation('#height');
  getDynamicInformation('#weight');
  getDynamicInformation('#age');
};

/* harmony default export */ __webpack_exports__["default"] = (calc);

/***/ }),

/***/ "./src/js/modules/cards.js":
/*!*********************************!*\
  !*** ./src/js/modules/cards.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./src/js/services/services.js");


const cards = () => {
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = +price;

      for (var _len = arguments.length, classes = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
        classes[_key - 6] = arguments[_key];
      }

      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 30.3;
      this.currencyConrertation();
    }

    currencyConrertation() {
      this.price = Math.floor(this.price * this.transfer);
    }

    render() {
      const elem = document.createElement('div');

      if (this.classes.length === 0) {
        this.element = 'menu__item';
        elem.classList.add(this.element);
      } else {
        this.classes.forEach(className => elem.classList.add(className));
      }

      elem.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
      this.parent.append(elem);
    }

  }

  (0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResource)('http://localhost:3000/menu').then(data => {
    data.forEach(_ref => {
      let {
        img,
        altimg,
        title,
        descr,
        price
      } = _ref;
      new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (cards);

/***/ }),

/***/ "./src/js/modules/form.js":
/*!********************************!*\
  !*** ./src/js/modules/form.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./src/js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./src/js/services/services.js");



const form = (formSelector, modalTimerId) => {
  const formsAll = document.querySelectorAll(formSelector);
  const message = {
    success: 'Thank you! <br> We will contact you soon.',
    failure: 'Something went wrong...'
  };
  formsAll.forEach(form => bindPostData(form));

  function bindPostData(form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const progressBar = document.createElement('div'),
            progressSub = document.createElement('div'),
            statusMessage = document.createElement('div');
      progressBar.classList.add('progress-bar');
      progressSub.classList.add('progress-sub');
      statusMessage.classList.add('status');
      progressBar.append(progressSub);
      form.insertAdjacentElement('afterend', progressBar);
      const formData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formData.entries()));
      (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json).then(data => {
        console.log(data);
        progressBar.remove();
        showThanksModal(message.success);
      }).catch(() => {
        progressBar.remove();
        showThanksModal(message.failure);
      }).finally(() => {
        form.reset();
      });
    });

    function showThanksModal(message) {
      const modalDialog = document.querySelector('.modal__dialog');
      modalDialog.classList.add('hide');
      (0,_modal__WEBPACK_IMPORTED_MODULE_0__.openModal)('.modal', modalTimerId);
      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog', 'show');
      thanksModal.innerHTML = `
                <div class="modal__content">
                    <div data-close-modal class="modal__close">&times;</div>
                    <div class="modal__title">${message}</div>
                </div>
            `;
      document.querySelector('.modal').append(thanksModal);
      setTimeout(() => {
        thanksModal.remove();
        setTimeout(() => {
          modalDialog.classList.remove('hide');
          modalDialog.classList.add('show');
        }, 1500);
        (0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)('.modal');
      }, 4000);
    }
  }
};

/* harmony default export */ __webpack_exports__["default"] = (form);

/***/ }),

/***/ "./src/js/modules/modal.js":
/*!*********************************!*\
  !*** ./src/js/modules/modal.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeModal": function() { return /* binding */ closeModal; },
/* harmony export */   "openModal": function() { return /* binding */ openModal; }
/* harmony export */ });
function openModal(modalSelector, modalTimerId) {
  const modalWindow = document.querySelector(modalSelector);
  modalWindow.classList.remove('fadeOut');
  modalWindow.classList.remove('hide');
  modalWindow.classList.add('fadeIn');
  modalWindow.classList.add('show');
  document.body.style.overflow = 'hidden';

  if (modalTimerId) {
    clearInterval(modalTimerId);
  }
}

function closeModal(modalSelector) {
  const modalWindow = document.querySelector(modalSelector);
  modalWindow.classList.remove('fadeIn');
  modalWindow.classList.add('fadeOut');
  setTimeout(() => {
    modalWindow.classList.remove('show');
    modalWindow.classList.add('hide');
  }, 1000);
  document.body.style.overflow = '';
}

const modal = (modalSelector, triggerSelector, modalTimerId) => {
  const modalWindow = document.querySelector(modalSelector),
        modalTrigger = document.querySelectorAll(triggerSelector);
  modalTrigger.forEach(trigger => {
    trigger.addEventListener('click', () => openModal(modalSelector, modalTimerId));
  });

  function closeModalByEvent(area, action) {
    area.addEventListener(action, e => {
      if (e.target == modalWindow || e.target.getAttribute('data-close-modal') == '' || e.code == 'Escape') {
        closeModal(modalSelector);
      }
    });
  }

  closeModalByEvent(modalWindow, 'click');
  closeModalByEvent(document, 'keydown');

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal(modalSelector, modalTimerId);
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);
};

/* harmony default export */ __webpack_exports__["default"] = (modal);


/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const slider = _ref => {
  let {
    container,
    slide,
    nextArrow,
    prevArrow,
    totalCounern,
    currentCouner,
    wrapper,
    field
  } = _ref;
  const mainSlider = document.querySelector(container),
        prev = mainSlider.querySelector(prevArrow),
        next = mainSlider.querySelector(nextArrow),
        current = mainSlider.querySelector(currentCouner),
        total = mainSlider.querySelector(totalCounern),
        sliderWrapper = mainSlider.querySelector(wrapper),
        sliderInner = sliderWrapper.querySelector(field),
        slides = sliderInner.querySelectorAll(slide),
        width = window.getComputedStyle(sliderWrapper).width;

  function counterWithZero(amount, counter) {
    if (amount < 10) {
      counter.textContent = `0${amount}`;
    } else {
      counter.textContent = amount;
    }
  }

  function activeDot() {
    dotsArr.forEach(dot => dot.style.opacity = '0.5');
    dotsArr[slideIndex - 1].style.opacity = '1';
  }

  let slideIndex = 1,
      offset = 0;
  mainSlider.style.position = 'relative';
  slides.forEach(slide => slide.style.width = width);
  sliderWrapper.style.overflow = 'hidden';
  sliderInner.style.cssText = `
        width: ${slides.length * 100}%;
        display: flex;
        transition: 0.5s all;
    `;
  counterWithZero(slides.length, total);
  counterWithZero(slideIndex, current);
  const dots = document.createElement('ol'),
        dotsArr = [];
  dots.classList.add('carousel-indicators');
  mainSlider.append(dots);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('data-slide-to', i + 1);

    if (i == 0) {
      dot.style.opacity = '1';
    }

    dots.append(dot);
    dotsArr.push(dot);
  }

  function keepNum(str) {
    return +str.replace(/\D/g, '');
  }

  next.addEventListener('click', () => {
    if (offset == keepNum(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += keepNum(width);
    }

    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    counterWithZero(slideIndex, current);
    activeDot();
    sliderInner.style.transform = `translateX(-${offset}px)`;
  });
  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = keepNum(width) * (slides.length - 1);
    } else {
      offset -= keepNum(width);
    }

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    counterWithZero(slideIndex, current);
    activeDot();
    sliderInner.style.transform = `translateX(-${offset}px)`;
  });
  dotsArr.forEach(dot => {
    dot.addEventListener('click', e => {
      const slideTo = e.target.getAttribute('data-slide-to');
      slideIndex = slideTo;
      offset = keepNum(width) * (slideTo - 1);
      counterWithZero(slideIndex, current);
      activeDot();
      sliderInner.style.transform = `translateX(-${offset}px)`;
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (slider);

/***/ }),

/***/ "./src/js/modules/tabs.js":
/*!********************************!*\
  !*** ./src/js/modules/tabs.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const tabs = (tabsSelector, contentsSelector, parentSelector, activeClass) => {
  const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(contentsSelector),
        tabsParent = document.querySelector(parentSelector);

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.remove('show', 'fade');
      item.classList.add('hide');
    });
    tabs.forEach(tab => {
      tab.classList.remove(activeClass);
    });
  }

  function showTabContent() {
    let i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    tabsContent[i].classList.remove('hide');
    tabsContent[i].classList.add('show', 'fade');
    tabs[i].classList.add(activeClass);
  }

  hideTabContent();
  showTabContent();
  tabsParent.addEventListener('click', event => {
    const target = event.target;

    if (target && target.classList.contains(tabsSelector.slice(1))) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (tabs);

/***/ }),

/***/ "./src/js/modules/timer.js":
/*!*********************************!*\
  !*** ./src/js/modules/timer.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const timerClock = (setDeadline, selector) => {
  const deadline = setDeadline,
        timer = document.querySelector(selector);

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const t = Date.parse(endtime) - Date.parse(new Date());

    if (t <= 0) {
      const promotionEndedMessage = document.createElement('div');
      promotionEndedMessage.classList.add('promotion__message');
      promotionEndedMessage.innerHTML = 'Акция закончилась';
      timer.innerHTML = '';
      timer.style.display = 'block';
      timer.append(promotionEndedMessage);
      setTimeout(() => {
        document.querySelector('.promotion').style.display = 'none';
        document.querySelector('.divider_before-prom').style.display = 'none';
      }, 5000);
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24)), hours = Math.floor(t / (1000 * 60 * 60) % 24), minutes = Math.floor(t / (1000 * 60) % 60), seconds = Math.floor(t / 1000 % 60);
    }

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function addZero(num) {
    if (num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(endtime) {
    const days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);
      days.innerHTML = addZero(t.days);
      hours.innerHTML = addZero(t.hours);
      minutes.innerHTML = addZero(t.minutes);
      seconds.innerHTML = addZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(deadline);
};

/* harmony default export */ __webpack_exports__["default"] = (timerClock);

/***/ }),

/***/ "./src/js/services/services.js":
/*!*************************************!*\
  !*** ./src/js/services/services.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getResource": function() { return /* binding */ getResource; },
/* harmony export */   "postData": function() { return /* binding */ postData; }
/* harmony export */ });
const postData = async (url, data) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: data
  });
  return await res.json();
};

const getResource = async url => {
  let res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }

  return await res.json();
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/tabs */ "./src/js/modules/tabs.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/timer */ "./src/js/modules/timer.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/modal */ "./src/js/modules/modal.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/cards */ "./src/js/modules/cards.js");
/* harmony import */ var _modules_form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/form */ "./src/js/modules/form.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/slider */ "./src/js/modules/slider.js");
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/calc */ "./src/js/modules/calc.js");








window.addEventListener('DOMContentLoaded', () => {
  const modalTimerId = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_2__.openModal)('.modal', modalTimerId), 600000);
  (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_0__["default"])('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
  (0,_modules_timer__WEBPACK_IMPORTED_MODULE_1__["default"])('2022-05-25', '.timer');
  (0,_modules_modal__WEBPACK_IMPORTED_MODULE_2__["default"])('.modal', '[data-modal]', modalTimerId);
  (0,_modules_cards__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_modules_form__WEBPACK_IMPORTED_MODULE_4__["default"])('form', modalTimerId);
  (0,_modules_slider__WEBPACK_IMPORTED_MODULE_5__["default"])({
    container: '.offer__slider',
    nextArrow: '.offer__slider-next',
    prevArrow: '.offer__slider-prev',
    slide: '.offer__slide',
    totalCounern: '#total',
    currentCouner: '#current',
    wrapper: '.offer__slider-wrapper',
    field: '.offer__slider-inner'
  });
  (0,_modules_calc__WEBPACK_IMPORTED_MODULE_6__["default"])();
});
}();
/******/ })()
;
//# sourceMappingURL=script.js.map