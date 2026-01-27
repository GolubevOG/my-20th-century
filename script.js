// Основной скрипт приложения
class App {
    constructor() {
        this.currentCategory = 'Политические деятели';
        this.darkMode = localStorage.getItem('darkMode') === 'true';
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
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.applyDarkMode();
    }

    renderCategories() {
        const categorySelector = document.getElementById('categorySelector');
        categorySelector.innerHTML = '';

        window.appData.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = `category-btn ${category.id === this.currentCategory ? 'selected' : ''}`;
            button.textContent = category.label;
            button.addEventListener('click', () => this.selectCategory(category.id));
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
        const categoryTitle = document.getElementById('categoryTitle');
        const category = window.appData.categories.find(cat => cat.id === this.currentCategory);

        if (category) {
            categoryTitle.innerHTML = `
                <h2>${category.label}</h2>
                <div class="divider"></div>
            `;
        }
    }

    renderPeople() {
        const peopleGrid = document.getElementById('peopleGrid');
        const category = window.appData.categories.find(cat => cat.id === this.currentCategory);

        if (!category) return;

        peopleGrid.innerHTML = '';

        category.people.forEach(person => {
            const personCard = this.createPersonCard(person);
            peopleGrid.appendChild(personCard);
        });
    }

    createPersonCard(person) {
        const card = document.createElement('div');
        card.className = 'person-card';

        // Проверяем, является ли photoAfter допустимым URL
        const hasValidAfterUrl = person.photoAfter &&
            (person.photoAfter.includes('http://') || person.photoAfter.includes('https://'));

        card.innerHTML = `
            <div class="photo-container">
                <img src="${person.photoBefore}" alt="${person.name}" class="person-photo" data-before="${person.photoBefore}" data-after="${person.photoAfter}">
                <div class="overlay">
                    <p class="overlay-text">Нажмите для фото после репрессии</p>
                </div>
                <div class="status-indicator">До репрессии</div>
            </div>
            <div class="card-content">
                <h3 class="person-name">${person.name}</h3>
                <p class="person-years">${person.years}</p>
                <p class="person-field">${person.field}</p>
                <div class="person-biography">${person.biography}</div>
                <div class="additional-info">
                    <div class="info-item">
                        <span class="info-label">Дата репрессии:</span>
                        <span class="info-value">${person.repressionDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Судьба:</span>
                        <span class="info-value">${person.fate}</span>
                    </div>
                    ${!hasValidAfterUrl ? '<div class="archived-note">* Фото после репрессии недоступно (архивные данные)</div>' : ''}
                </div>
            </div>
        `;

        // Добавляем обработчик клика на фото
        const photoContainer = card.querySelector('.photo-container');
        const photoImg = card.querySelector('.person-photo');
        const statusIndicator = card.querySelector('.status-indicator');

        let showAfterPhoto = false;

        photoContainer.addEventListener('click', () => {
            if (hasValidAfterUrl) {
                showAfterPhoto = !showAfterPhoto;

                if (showAfterPhoto) {
                    photoImg.src = person.photoAfter;
                    statusIndicator.textContent = 'После репрессии';
                    statusIndicator.classList.add('status-after');
                } else {
                    photoImg.src = person.photoBefore;
                    statusIndicator.textContent = 'До репрессии';
                    statusIndicator.classList.remove('status-after');
                }
            } else {
                // Если нет допустимого URL для фото после, просто показываем сообщение
                alert('Фото после репрессии недоступно (архивные данные)');
            }

            // Добавляем эффект размытия, если фото после недоступно
            if (!hasValidAfterUrl) {
                photoImg.classList.toggle('blur');
            }
        });

        // Обработка ошибки загрузки изображения
        photoImg.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12"%3EФото недоступно%3C/text%3E%3C/svg%3E';
        });

        return card;
    }

    addEventListeners() {
        // Добавляем обработчик для переключения темы (кликая на заголовок)
        const titleElement = document.querySelector('.title');
        if (titleElement) {
            titleElement.addEventListener('dblclick', () => {
                this.toggleDarkMode();
            });
        }
    }
}

// Глобальная переменная для хранения экземпляра приложения
let globalAppInstance = null;

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    globalAppInstance = new App();
});

// Добавляем возможность переключения темы по нажатию клавиш
document.addEventListener('keydown', (event) => {
    // Переключение темы по нажатию T
    if ((event.key === 't' || event.key === 'T') && globalAppInstance) {
        globalAppInstance.toggleDarkMode();
    }
});