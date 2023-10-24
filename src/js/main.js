document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.header__burger');
  const headerMenu = document.querySelector('.header__menu');
  const headerNav = document.querySelector('.header__nav');
  const searchOpen = document.querySelector('.header__search');
  const searchForm = document.querySelector('.header__search-form');
  const searchClose = document.querySelector('.header__search-close');

  burger.addEventListener('click', () => {
    const main = document.querySelector('.main');
    const footer = document.querySelector('.footer');

    if (burger.classList.contains('header__burger--is-active')) {
      document.body.style.removeProperty('overflow');

      setTimeout(() => {
        burger.classList.remove('header__burger--is-active');
      }, 200);

      setTimeout(() => {
        headerNav.classList.remove('header__nav--is-open');
      }, 400);

      setTimeout(() => {
        headerMenu.classList.remove('header__menu--is-open');
        headerNav.style.removeProperty('display');
      }, 600);

      main.inert = false;
      footer.inert = false;
    } else {
      document.body.style.overflow = 'hidden';
      headerNav.style.display = 'flex';

      setTimeout(() => {
        burger.classList.add('header__burger--is-active');
      }, 200);

      setTimeout(() => {
        headerMenu.classList.add('header__menu--is-open');
      }, 400);

      setTimeout(() => {
        headerNav.classList.add('header__nav--is-open');
      }, 600);

      main.inert = true;
      footer.inert = true;
    }
  });

  searchOpen.addEventListener('click', () => {
    setTimeout(() => {
      searchForm.classList.add('header__search-form--is-open');
      searchOpen.disabled = true;
    }, 200);

    if (document.documentElement.clientWidth > 768) {
      headerNav.classList.add('header__nav--is-hidden');
    }
  });

  searchClose.addEventListener('click', () => {
    setTimeout(() => {
      searchForm.classList.remove('header__search-form--is-open');
    }, 200);

    headerNav.classList.remove('header__nav--is-hidden');

    searchOpen.disabled = false;
  });

  document.addEventListener('click', e => {
    if (searchForm.classList.contains('header__search-form--is-open') && !e.target.closest('.header')) {
      searchClose.click();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && burger.classList.contains('header__burger--is-active')) {
      burger.click();
    }

    if (e.key === 'Escape' && searchForm.classList.contains('header__search-form--is-open')) {
      searchClose.click();
    }
  });

  ymaps.ready(init);

  function init() {
    const map = new ymaps.Map('map', {
      zoom: 13,
      center: [55.76, 37.62],
      controls: []
    });

    const placemark = new ymaps.Placemark([55.769560, 37.638465], {}, {
      iconLayout: 'default#image',
      iconImageHref: '../img/sprite.svg#placemark',
      iconImageSize: [12, 12],
      iconImageOffset: [-6, -6],
    });

    map.geoObjects.add(placemark);
    map.behaviors.disable('scrollZoom');

    const locationDetails = document.querySelector('.contacts__location-details');
    const locationClose = document.querySelector('.contacts__location-close');

    placemark.events.add('click', () => {
      locationDetails.classList.toggle('contacts__location-details--is-open');
    });

    locationClose.addEventListener('click', () => {
      setTimeout(() => {
        locationDetails.classList.remove('contacts__location-details--is-open');
      }, 200);
    });
  }

  const aboutValidation = new JustValidate('.about__form', {
    errorLabelStyle: {
      color: '#f06666',
    },
  });

  aboutValidation
    .addField('.about__input-email', [
      {
        rule: 'required',
        errorMessage: 'Введите почту',
      },
      {
        rule: 'email',
        errorMessage: 'Недопустимый формат',
      },
    ]);

  const contactsValidation = new JustValidate('.contacts__form', {
    errorLabelStyle: {
      color: '#ff3030',
    },
  });

  contactsValidation
    .addField('.contacts__input-name', [
      {
        rule: 'required',
        errorMessage: 'Введите имя',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Недопустимый формат',
      },
      {
        rule: 'maxLength',
        value: 25,
        errorMessage: 'Недопустимый формат',
      },
      {
        rule: 'customRegexp',
        value: /^[А-ЯЁ][а-яё]{1,19}$/,
        errorMessage: 'Недопустимый формат',
      },
    ])
    .addField('.contacts__input-email', [
      {
        rule: 'required',
        errorMessage: 'Введите почту',
      },
      {
        rule: 'email',
        errorMessage: 'Недопустимый формат',
      },
    ])
    .addField('.contacts__textarea-message', [
      {
        rule: 'required',
        errorMessage: 'Введите сообщение',
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Введите сообщение',
      },
    ]);
});
