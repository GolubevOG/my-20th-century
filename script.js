// Основной скрипт приложения
class App {
  constructor() {
    this.currentCategory = "Политические деятели";
    // Устанавливаем темную тему по умолчанию, но проверяем localStorage для сохранения предпочтений пользователя
    const storedDarkMode = localStorage.getItem("darkMode");
    this.darkMode = storedDarkMode !== null ? storedDarkMode === "true" : true; // по умолчанию true (темная тема)
    this.init();
  }

  init() {
    this.applyDarkMode();
    this.renderCategories();
    this.updateCategoryTitle();
    this.renderPeople();
    this.addEventListeners();
  }

  applyDarkMode() {
    // Устанавливаем атрибут для более строгого контроля темы
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');

    // Также добавляем/удаляем класс для совместимости с CSS
    if (this.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Обновляем состояние UI элементов, связанных с темой
    this.updateThemeUI();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode);
    this.applyDarkMode();

    // Добавляем плавный переход при смене темы
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  updateThemeUI() {
    // Обновляем иконку кнопки переключения темы
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.textContent = this.darkMode ? '☀️' : '🌙';
    } else {
      // Если элемента с ID themeIcon нет, обновляем текст самой кнопки
      const themeToggleBtn = document.getElementById('themeToggle');
      if (themeToggleBtn) {
        themeToggleBtn.textContent = this.darkMode ? '☀️' : '🌙';
      }
    }
  }

  renderCategories() {
    const categorySelector = document.getElementById("categorySelector");
    categorySelector.innerHTML = "";

    window.appData.categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = `category-btn ${category.id === this.currentCategory ? "selected" : ""}`;
      button.textContent = category.label;
      button.addEventListener("click", () => this.selectCategory(category.id));
      categorySelector.appendChild(button);
    });
  }

  selectCategory(categoryId) {
    this.currentCategory = categoryId;
    this.renderCategories(); // Обновляем кнопки категорий
    this.updateCategoryTitle();
    this.renderPeople();
  }

  updateCategoryTitle() {
    const categoryTitle = document.getElementById("categoryTitle");
    const category = window.appData.categories.find(
      (cat) => cat.id === this.currentCategory,
    );

    if (category) {
      categoryTitle.innerHTML = `
                <h2>${category.label}</h2>
                <div class="divider"></div>
            `;
    }
  }

  renderPeople() {
    const peopleGrid = document.getElementById("peopleGrid");
    const category = window.appData.categories.find(
      (cat) => cat.id === this.currentCategory,
    );

    if (!category) return;

    peopleGrid.innerHTML = "";

    category.people.forEach((person) => {
      const personCard = this.createPersonCard(person);
      peopleGrid.appendChild(personCard);
    });
  }

  createPersonCard(person) {
    const card = document.createElement("div");
    card.className = "person-card";
    card.setAttribute("role", "article");
    card.setAttribute("aria-labelledby", `person-name-${person.id}`);

    // Проверяем, является ли photoAfter допустимым URL или локальным изображением
    const hasValidAfterUrl =
      person.photoAfter &&
      (person.photoAfter.includes("http://") ||
        person.photoAfter.includes("https://") ||
        person.photoAfter.startsWith("./images/") ||
        person.photoAfter.startsWith("/images/"));

    card.innerHTML = `
            <div class="photo-container" role="button" tabindex="0" aria-label="Просмотреть фото ${person.name} до и после репрессии">
                <img src="" data-src="${person.photoBefore}" alt="${person.name}" class="person-photo lazy-load" data-before="${person.photoBefore}" data-after="${person.photoAfter}" id="person-photo-${person.id}">
                <div class="overlay">
                    <p class="overlay-text">Нажмите на фото</p>
                </div>
                <div class="status-indicator" id="status-${person.id}">До репрессии</div>
            </div>
            <div class="card-content">
                <div class="info-section info-section-1" id="info-section-1-${person.id}">
                    <h3 class="person-name" id="person-name-${person.id}">${person.name}</h3>
                    <p class="person-years" id="person-years-${person.id}">${person.years}</p>
                    <p class="person-field" id="person-field-${person.id}">${person.field}</p>
                    <div class="person-biography" id="person-biography-${person.id}">${person.biography}</div>
                </div>
                <div class="info-section info-section-2" id="info-section-2-${person.id}" style="display: none; opacity: 0; transform: translateY(10px);" aria-hidden="true">
                    <div class="additional-info">
                        <div class="info-item">
                            <span class="info-label">Дата репрессии:</span>
                            <span class="info-value" id="repression-date-${person.id}">${person.repressionDate}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Судьба:</span>
                            <span class="info-value" id="fate-${person.id}">${person.fate}</span>
                        </div>
                        ${!hasValidAfterUrl || person.photoAfter === null ? '<div class="archived-note">Фото недоступно</div>' : ""}
                    </div>
                </div>
            </div>
        `;

    // Добавляем обработчик клика на фото
    const photoContainer = card.querySelector(".photo-container");
    const photoImg = card.querySelector(".person-photo");
    const statusIndicator = card.querySelector(".status-indicator");
    const infoSection1 = card.querySelector(".info-section-1");
    const infoSection2 = card.querySelector(".info-section-2");

    let showAfterPhoto = false;
    let showInfoSection2 = false;

    // Функция для переключения фото и информации
    const togglePhotoAndInfo = () => {
      if (hasValidAfterUrl && person.photoAfter !== null) {
        showAfterPhoto = !showAfterPhoto;

        if (showAfterPhoto) {
          photoImg.src = person.photoAfter;
          statusIndicator.textContent = "После репрессии";
          statusIndicator.classList.add("status-after");
          photoContainer.setAttribute("aria-label", `Фото ${person.name} после репрессии`);
        } else {
          photoImg.src = person.photoBefore;
          statusIndicator.textContent = "До репрессии";
          statusIndicator.classList.remove("status-after");
          photoContainer.setAttribute("aria-label", `Фото ${person.name} до репрессии`);
        }
      } else {
        // Если фото после репрессий недоступно, переключаем размытие на исходном фото
        showAfterPhoto = !showAfterPhoto;
        if (showAfterPhoto) {
          photoImg.classList.add("blur");
          statusIndicator.textContent = "После репрессии";
          statusIndicator.classList.add("status-after");
          photoContainer.setAttribute("aria-label", `Фото ${person.name} после репрессии (размыто)`);
        } else {
          photoImg.classList.remove("blur");
          statusIndicator.textContent = "До репрессии";
          statusIndicator.classList.remove("status-after");
          photoContainer.setAttribute("aria-label", `Фото ${person.name} до репрессии`);
        }
      }

      // Переключаем отображение информации с анимацией
      showInfoSection2 = !showInfoSection2;

      if (showInfoSection2) {
        // Плавно скрываем первую часть
        infoSection1.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        infoSection1.style.opacity = '0';
        infoSection1.style.transform = 'translateY(-10px)';
        infoSection1.setAttribute("aria-hidden", "true");

        // Через короткую задержку показываем вторую часть
        setTimeout(() => {
          infoSection1.style.display = 'none';
          infoSection2.style.display = 'block';

          // Плавно показываем вторую часть
          infoSection2.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          infoSection2.style.opacity = '1';
          infoSection2.style.transform = 'translateY(0)';
          infoSection2.setAttribute("aria-hidden", "false");
        }, 300);
      } else {
        // Плавно скрываем вторую часть
        infoSection2.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        infoSection2.style.opacity = '0';
        infoSection2.style.transform = 'translateY(10px)';
        infoSection2.setAttribute("aria-hidden", "true");

        // Через короткую задержку показываем первую часть
        setTimeout(() => {
          infoSection2.style.display = 'none';
          infoSection1.style.display = 'block';

          // Плавно показываем первую часть
          infoSection1.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          infoSection1.style.opacity = '1';
          infoSection1.style.transform = 'translateY(0)';
          infoSection1.setAttribute("aria-hidden", "false");
        }, 300);
      }
    };

    // Обработчики событий
    photoContainer.addEventListener("click", togglePhotoAndInfo);

    // Добавляем поддержку клавиатуры для доступности
    photoContainer.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        togglePhotoAndInfo();
      }
    });

    // Обработка ошибки загрузки изображения
    photoImg.addEventListener("error", function () {
      // Попробуем загрузить резервное изображение
      if (!this.dataset.backupLoaded) {
        this.dataset.backupLoaded = "true";
        this.src = './images/placeholder.svg'; // Резервное изображение

        // Если и резервное изображение не загрузится, используем inline SVG
        this.onerror = function() {
          this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect fill="%23e0e0e0" width="400" height="600"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="16" fill="%23666666"%3EИзображение недоступно%3C/text%3E%3C/svg%3E';
        };
      }
    });

    // Инициализация lazy loading для изображения
    this.initializeLazyLoading(photoImg);

    return card;
  }

  initializeLazyLoading(imgElement) {
    // Проверяем, поддерживает ли браузер Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Загружаем изображение
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src; // Удаляем data-src, чтобы не загружать снова
            }
            imageObserver.unobserve(img); // Перестаем наблюдать за этим элементом
          }
        });
      });

      imageObserver.observe(imgElement);
    } else {
      // Резервный вариант для старых браузеров - просто загружаем изображение
      if (imgElement.dataset.src) {
        imgElement.src = imgElement.dataset.src;
        delete imgElement.dataset.src;
      }
    }
  }

  addEventListeners() {
    // Добавляем обработчик для переключения темы (кликая на заголовок)
    const titleElement = document.querySelector(".title");
    if (titleElement) {
      titleElement.addEventListener("dblclick", () => {
        this.toggleDarkMode();
      });
    }

    // Добавляем обработчик для кнопки переключения темы
    const themeToggleBtn = document.getElementById("themeToggle");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        this.toggleDarkMode();
      });
    }
  }
}

// Глобальная переменная для хранения экземпляра приложения
let globalAppInstance = null;

// Инициализация приложения после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  globalAppInstance = new App();
});

// Добавляем возможность переключения темы по нажатию клавиш
document.addEventListener("keydown", (event) => {
  // Переключение темы по нажатию T
  if ((event.key === "t" || event.key === "T") && globalAppInstance) {
    globalAppInstance.toggleDarkMode();
  }
});

// Регистрация сервис-воркера для PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW зарегистрирован: ', registration);
      })
      .catch(registrationError => {
        console.log('SW регистрация не удалась: ', registrationError);
      });
  });
}
