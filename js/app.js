// ======================================================
// ASTANA CITY SIMULATOR
// app.js
// ======================================================

const resultsScreen =
    document.getElementById("resultsScreen");

const resultBeforeScore =
    document.getElementById("resultBeforeScore");

const resultAfterScore =
    document.getElementById("resultAfterScore");

const resultImprovement =
    document.getElementById("resultImprovement");

const resultSpent =
    document.getElementById("resultSpent");

const resultAverage =
    document.getElementById("resultAverage");

const resultWeakest =
    document.getElementById("resultWeakest");

const resultCritical =
    document.getElementById("resultCritical");

const districtResults =
    document.getElementById("districtResults");

const aiAnalysisButton =
    document.getElementById("aiAnalysisButton");

const aiAnalysisBox =
    document.getElementById("aiAnalysisBox");

const aiAnalysisContent =
    document.getElementById("aiAnalysisContent");

const editScenarioButton =
    document.getElementById("editScenarioButton");

const newGameButton =
    document.getElementById("newGameButton");


document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // СОСТОЯНИЕ
    // ==================================================

   let selectedDistrict = "nura";
let selectedMeasures = [];
let currentCategory = null;
let lastSimulationResult = null;


// ======================================================
// КАРЬЕРА
// ======================================================

let career = {

    level: Number(
        localStorage.getItem("qanatLevel")
    ) || 1,

    bonusMoney: Number(
        localStorage.getItem("qanatBonusMoney")
    ) || 0,

    bestScores: JSON.parse(
        localStorage.getItem("qanatBestScores") || "{}"
    )

};


let currentLevel =
    gameLevels[career.level];


let MAX_BUDGET =
    currentLevel.baseBudget +
    career.bonusMoney;


const MAX_DECISIONS =
    simulationConfig.requiredDecisions;



    // ======================================================
// СОХРАНЕНИЕ КАРЬЕРЫ
// ======================================================

function saveCareer() {

    localStorage.setItem(
        "qanatLevel",
        career.level
    );

    localStorage.setItem(
        "qanatBonusMoney",
        career.bonusMoney
    );

    localStorage.setItem(
        "qanatBestScores",
        JSON.stringify(career.bestScores)
    );

}

    // ==================================================
    // ЭЛЕМЕНТЫ
    // ==================================================

    const startButton = document.getElementById("startGame");
    const homeScreen = document.querySelector(".game");
    const gameScreen = document.getElementById("gameScreen");
    const backHomeButton = document.getElementById("backHome");

    const districtButtons =
        document.querySelectorAll(".map-district");

    const categoryButtons =
        document.querySelectorAll(".category");

    const categoriesView =
        document.getElementById("categoriesView");

    const measuresView =
        document.getElementById("measuresView");

    const measuresList =
        document.getElementById("measuresList");

    const backCategories =
        document.getElementById("backCategories");

    const measureCategoryTitle =
        document.getElementById("measureCategoryTitle");

    const measureCategoryIcon =
        document.getElementById("measureCategoryIcon");

    const budgetValue =
        document.getElementById("budgetValue");

    const decisionCount =
        document.getElementById("decisionCount");

    const sideDecisionCount =
        document.getElementById("sideDecisionCount");

    const decisionProgress =
        document.getElementById("decisionProgress");

    const selectedMeasuresList =
        document.getElementById("selectedMeasuresList");

    const simulateButton =
        document.getElementById("simulateButton");


    // ==================================================
    // КАТЕГОРИИ
    // ==================================================

    const categoryInfo = {
        transport: {
            name: "Транспорт",
            icon: "🚌"
        },

        ecology: {
            name: "Экология",
            icon: "🌳"
        },

        social: {
            name: "Соцсфера",
            icon: "🏫"
        },

        safety: {
            name: "Безопасность",
            icon: "🛡️"
        },

        services: {
            name: "Сервисы",
            icon: "⚙️"
        }
    };



// ======================================================
// ИНФОРМАЦИЯ ОБ УРОВНЕ
// ======================================================

function showLevelIntro() {

    const level =
        currentLevel;


    alert(
        `${level.icon} УРОВЕНЬ ${level.id}\n\n` +

        `${level.name}\n\n` +

        `${level.description}\n\n` +

        `💰 Бюджет: ${MAX_BUDGET}\n` +

        `📋 Решений: 5\n\n` +

        `🎯 Цель Score: ${level.targetScore}\n` +

        (
            level.minWeakestDistrict > 0
                ? `📍 Слабейший район: не ниже ${level.minWeakestDistrict}\n`
                : ""
        ) +

        `⚠️ Критических: не больше ${level.maxCritical}\n\n` +

        `🏆 Награда: +${level.reward} 💰`
    );

}



    // ==================================================
    // ГЛАВНАЯ → ИГРА
    // ==================================================

  if (startButton) {

    startButton.addEventListener("click", () => {

        configureCurrentLevel();

        homeScreen.style.display = "none";

        resultsScreen.classList.remove("active");

        gameScreen.classList.add("active");


        selectedMeasures = [];

        selectedDistrict = "nura";

        currentCategory = null;

        lastSimulationResult = null;


        selectDistrict(selectedDistrict);

        updateGameUI();


        showLevelIntro();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

    // ==================================================
    // ИГРА → ГЛАВНАЯ
    // ==================================================

    if (backHomeButton) {

        backHomeButton.addEventListener("click", () => {

            gameScreen.classList.remove("active");
            homeScreen.style.display = "block";

            window.scrollTo(0, 0);

        });

    }


    // ==================================================
    // ВЫБОР РАЙОНА
    // ==================================================

    districtButtons.forEach(button => {

        button.addEventListener("click", () => {

            selectedDistrict =
                button.dataset.district;

            districtButtons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            selectDistrict(selectedDistrict);

        });

    });


    // ==================================================
    // ПОКАЗАТЬ РАЙОН
    // ==================================================

    function selectDistrict(districtId) {

        const district = districts[districtId];

        if (!district) {
            console.error("Район не найден:", districtId);
            return;
        }


        setText(
            "selectedDistrictName",
            district.name
        );

        setText(
            "selectedDistrictScore",
            district.score.toFixed(2)
        );


        updateIndicator(
            "T1",
            district.indicators.T1
        );

        updateIndicator(
            "T2",
            district.indicators.T2
        );

        updateIndicator(
            "E1",
            district.indicators.E1
        );

        updateIndicator(
            "E2",
            district.indicators.E2
        );

        updateIndicator(
            "S1",
            district.indicators.S1
        );

        updateIndicator(
            "S2",
            district.indicators.S2
        );

    }


    function updateIndicator(code, value) {

        const number =
            document.getElementById(
                `stat${code}`
            );

        const bar =
            document.getElementById(
                `bar${code}`
            );

        if (number) {
            number.textContent = value;
        }

        if (bar) {
            bar.style.width = `${value}%`;
        }

    }


    function setText(id, text) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = text;
        }

    }


    // ==================================================
    // НАЖАТИЕ НА КАТЕГОРИИ
    // ==================================================

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            let category = null;

            if (
                button.classList.contains("transport")
            ) {
                category = "transport";
            }

            else if (
                button.classList.contains("ecology")
            ) {
                category = "ecology";
            }

            else if (
                button.classList.contains("social")
            ) {
                category = "social";
            }

            else if (
                button.classList.contains("safety")
            ) {
                category = "safety";
            }

            else if (
                button.classList.contains("services")
            ) {
                category = "services";
            }


            if (!category) {
                return;
            }


            openCategory(category);

        });

    });


    // ==================================================
    // ОТКРЫТЬ КАТЕГОРИЮ
    // ==================================================

    function openCategory(category) {

        currentCategory = category;

        const info =
            categoryInfo[category];

        measureCategoryTitle.textContent =
            info.name;

        measureCategoryIcon.textContent =
            info.icon;


        categoriesView.classList.add("hidden");

        measuresView.classList.add("active");


        renderMeasures(category);

    }


    // ==================================================
    // НАЗАД К КАТЕГОРИЯМ
    // ==================================================

    if (backCategories) {

        backCategories.addEventListener(
            "click",
            () => {

                measuresView.classList.remove(
                    "active"
                );

                categoriesView.classList.remove(
                    "hidden"
                );

                currentCategory = null;

            }
        );

    }


    // ==================================================
    // ПОКАЗАТЬ M1-M14
    // ==================================================

    function renderMeasures(category) {

        measuresList.innerHTML = "";


        const categoryMeasures =
            measures.filter(
                measure =>
                    measure.category === category
            );


        categoryMeasures.forEach(measure => {

            const selected =
                selectedMeasures.some(
                    item =>
                        item.measureId ===
                        measure.id
                );


            const effects =
                Object.entries(measure.effects)
                    .map(([code, value]) => {

                        const sign =
                            value > 0 ? "+" : "";

                        const cssClass =
                            value < 0
                                ? "negative"
                                : "effect";

                        return `
                            <span class="measure-tag ${cssClass}">
                                ${code} ${sign}${value}
                            </span>
                        `;

                    })
                    .join("");


            const type =
                measure.type === "city"
                    ? "🏙️ Весь город"
                    : "📍 Район";


            const card =
                document.createElement("div");


            card.className =
                "measure-card";


            card.innerHTML = `

                <div class="measure-top">

                    <div class="measure-icon">
                        ${measure.icon}
                    </div>

                    <div class="measure-name">

                        <small>
                            ${measure.id}
                        </small>

                        <strong>
                            ${measure.name}
                        </strong>

                    </div>

                </div>


                <div class="measure-meta">

                    <span class="measure-tag cost">
                        💰 ${measure.cost}
                    </span>

                    <span class="measure-tag">
                        ⏱ ${measure.lag} кв.
                    </span>

                    <span class="measure-tag">
                        ${type}
                    </span>

                    ${effects}

                </div>


                <button
                    class="select-measure"
                    data-measure="${measure.id}"
                    ${selected ? "disabled" : ""}
                >

                    ${
                        selected
                            ? "✓ УЖЕ ВЫБРАНО"
                            : "ВЫБРАТЬ"
                    }

                </button>
            `;


            measuresList.appendChild(card);

        });


        // Кнопки ВЫБРАТЬ

        measuresList
            .querySelectorAll(".select-measure")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        addMeasure(
                            button.dataset.measure
                        );

                    }
                );

            });

    }


    // ==================================================
    // ДОБАВИТЬ МЕРОПРИЯТИЕ
    // ==================================================

    function addMeasure(measureId) {

        const measure =
            measures.find(
                item =>
                    item.id === measureId
            );


        if (!measure) {
            showMessage(
                "Мероприятие не найдено."
            );
            return;
        }


        // Максимум 5

        if (
            selectedMeasures.length >=
            MAX_DECISIONS
        ) {

            showMessage(
                "Можно принять ровно 5 решений."
            );

            return;
        }


        // Запрет повторов

        if (
            selectedMeasures.some(
                item =>
                    item.measureId ===
                    measure.id
            )
        ) {

            showMessage(
                `${measure.id} уже выбрано.`
            );

            return;
        }


        // Бюджет

        const remaining =
            getRemainingBudget();


        if (measure.cost > remaining) {

            showMessage(
                `Недостаточно бюджета. Осталось ${remaining}, стоимость мероприятия — ${measure.cost}.`
            );

            return;
        }


        // Максимум 2 из направления

        const categoryCount =
            selectedMeasures.filter(
                item =>
                    item.category ===
                    measure.category
            ).length;


        if (
            categoryCount >=
            simulationConfig.maxMeasuresPerCategory
        ) {

            showMessage(
                `Можно выбрать максимум 2 мероприятия направления «${measure.categoryName}».`
            );

            return;
        }


        // Районная / городская мера

        const districtId =
            measure.type === "district"
                ? selectedDistrict
                : null;


        // Конфликты

        const conflict =
            findConflict(
                measure,
                districtId
            );


        if (conflict) {

            showMessage(conflict);

            return;
        }


        // Добавляем решение

        selectedMeasures.push({

            measureId: measure.id,

            category: measure.category,

            district: districtId,

            cost: measure.cost

        });


        updateGameUI();


        if (currentCategory) {

            renderMeasures(
                currentCategory
            );

        }

    }


    // ==================================================
    // КОНФЛИКТЫ
    // ==================================================

    function findConflict(
        newMeasure,
        newDistrict
    ) {

        for (
            const rule of incompatibilities
        ) {

            if (
                !rule.measures.includes(
                    newMeasure.id
                )
            ) {
                continue;
            }


            const otherId =
                rule.measures.find(
                    id =>
                        id !== newMeasure.id
                );


            const other =
                selectedMeasures.find(
                    item =>
                        item.measureId ===
                        otherId
                );


            if (!other) {
                continue;
            }


            // M1 + M3

            if (
                rule.sameDistrictOnly === false
            ) {

                return rule.message;

            }


            // M4 + M7
            // M5 + M13

            if (
                rule.sameDistrictOnly === true &&
                other.district === newDistrict
            ) {

                return rule.message;

            }

        }


        return null;

    }


    // ==================================================
    // УДАЛИТЬ МЕРОПРИЯТИЕ
    // ==================================================

    function removeMeasure(measureId) {

        selectedMeasures =
            selectedMeasures.filter(
                item =>
                    item.measureId !==
                    measureId
            );


        updateGameUI();


        if (currentCategory) {

            renderMeasures(
                currentCategory
            );

        }

    }


    // ==================================================
    // БЮДЖЕТ
    // ==================================================

    function getRemainingBudget() {

        const spent =
            selectedMeasures.reduce(
                (total, item) =>
                    total + item.cost,
                0
            );


        return MAX_BUDGET - spent;

    }


    // ==================================================
    // ОБНОВЛЕНИЕ UI
    // ==================================================

    function updateGameUI() {

        const count =
            selectedMeasures.length;

        const remaining =
            getRemainingBudget();


        budgetValue.textContent =
            remaining;

        decisionCount.textContent =
            count;

        sideDecisionCount.textContent =
            count;


        decisionProgress.style.width =
            `${(count / MAX_DECISIONS) * 100}%`;


        // Активируем только при 5 решениях

        simulateButton.disabled =
            count !== MAX_DECISIONS;


        renderSelectedMeasures();

    }


    // ==================================================
    // ВЫБРАННЫЕ РЕШЕНИЯ
    // ==================================================

    function renderSelectedMeasures() {

        selectedMeasuresList.innerHTML = "";


        selectedMeasures.forEach(selected => {

            const measure =
                measures.find(
                    item =>
                        item.id ===
                        selected.measureId
                );


            if (!measure) {
                return;
            }


            const location =
                selected.district
                    ? districts[
                        selected.district
                    ].name
                    : "Весь город";


            const row =
                document.createElement("div");


            row.className =
                "selected-measure";


            row.innerHTML = `

                <div>

                    <strong>
                        ${measure.icon}
                        ${measure.id}
                        ${measure.name}
                    </strong>

                    <small>
                        📍 ${location}
                        • 💰 ${measure.cost}
                    </small>

                </div>


                <button
                    class="remove-measure"
                    data-remove="${measure.id}"
                    title="Отменить"
                >
                    ×
                </button>

            `;


            selectedMeasuresList.appendChild(
                row
            );

        });


        selectedMeasuresList
            .querySelectorAll(".remove-measure")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        removeMeasure(
                            button.dataset.remove
                        );

                    }
                );

            });

    }


    // ==================================================
    // СООБЩЕНИЯ
    // ==================================================

    function showMessage(message) {

        alert(message);

    }



  // ==================================================
// ЗАПУСТИТЬ СИМУЛЯЦИЮ
// ==================================================

simulateButton.addEventListener("click", () => {

    const result = simulateScenario(selectedMeasures);

    if (!result.success) {

        alert(
            result.validation.errors.join("\n")
        );

        return;
    }

    // Сохраняем результат для AI
    lastSimulationResult = result;

    showResults(result);

});




function showResults(result) {

    // Скрываем игру
    gameScreen.classList.remove("active");

    // Показываем результаты
    resultsScreen.classList.add("active");


    // Основной Score
    resultBeforeScore.textContent =
        result.baseScore.toFixed(2);

    resultAfterScore.textContent =
        result.finalScore.toFixed(2);


    // Изменение Score
    const improvement =
        result.improvement;

    resultImprovement.textContent =
        improvement >= 0
            ? `+${improvement.toFixed(2)}`
            : improvement.toFixed(2);


    // Потраченный бюджет
    const spent =
        MAX_BUDGET -
        result.validation.remainingBudget;

    resultSpent.textContent =
        `${spent}/${MAX_BUDGET}`;


    // Средний балл
    resultAverage.textContent =
        result.cityAverage.toFixed(2);


    // Слабейший район
    resultWeakest.textContent =
        result.weakestDistrictScore.toFixed(2);


    // Критические показатели
    resultCritical.textContent =
        result.criticalCount;

        // ======================================================
// СОХРАНЯЕМ ЛУЧШИЙ SCORE
// ======================================================

const oldBest =
    career.bestScores[career.level] || 0;


if (result.finalScore > oldBest) {

    career.bestScores[career.level] =
        result.finalScore;

    saveCareer();

}


    // Районы
    renderDistrictResults(result);


    // Показываем страницу сверху
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==================================================
// РЕЗУЛЬТАТЫ РАЙОНОВ
// ==================================================

function renderDistrictResults(result) {

    districtResults.innerHTML = "";

    const icons = {
        esil: "🏙️",
        almaty: "🏢",
        saryarka: "🏠",
        baikonur: "🏡",
        nura: "🏘️"
    };


    Object.entries(result.districts)
        .forEach(([districtId, district]) => {

            const oldScore =
                districts[districtId].score;

            const newScore =
                district.newScore;

            const difference =
                newScore - oldScore;


            const card =
                document.createElement("div");

            card.className =
                "district-result";


            card.innerHTML = `

                <div class="district-result-icon">
                    ${icons[districtId]}
                </div>

                <h3>
                    ${district.name}
                </h3>

                <div class="district-result-scores">

                    <span class="old-score">
                        ${oldScore.toFixed(2)}
                    </span>

                    <span>→</span>

                    <span class="new-score">
                        ${newScore.toFixed(2)}
                    </span>

                </div>

                <div class="district-change">
                    ${difference >= 0 ? "+" : ""}
                    ${difference.toFixed(2)}
                </div>

            `;


            districtResults.appendChild(card);

        });

}




// ======================================================
// ФОРМАТИРОВАНИЕ AI ОТВЕТА
// ======================================================

function formatAIAnalysis(text) {

    if (!text) {
        return "<p>AI не вернул анализ.</p>";
    }

    // Защита от HTML
    let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // **жирный текст**
    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    // Заголовки вида:
    // 1. Общая оценка результата
    // 2. Что было сделано хорошо
    formatted = formatted.replace(
        /(?:^|\n)(\d+)\.\s*(?:<strong>)?([^<\n]+)(?:<\/strong>)?/g,
        '</p><div class="ai-section"><h3><span class="ai-number">$1</span>$2</h3><p>'
    );

    // Маркированные пункты
    formatted = formatted.replace(
        /\n-\s+/g,
        "<br>• "
    );

    // Переносы строк
    formatted = formatted.replace(
        /\n/g,
        "<br>"
    );

    // Убираем пустой первый абзац
    formatted = formatted.replace(
        /^<\/p>/,
        ""
    );

    // Закрываем последний блок
    formatted += "</p></div>";

    return formatted;
}

// ======================================================
// AI АНАЛИЗ
// ======================================================

if (aiAnalysisButton) {

    aiAnalysisButton.addEventListener("click", async () => {

        if (!lastSimulationResult) {
            alert("Сначала запустите симуляцию.");
            return;
        }

        // Показываем блок AI
        if (aiAnalysisBox) {
            aiAnalysisBox.style.display = "block";
        }

        // Сохраняем текст кнопки
        const oldButtonText = aiAnalysisButton.textContent;

        aiAnalysisButton.disabled = true;
        aiAnalysisButton.textContent = "AI анализирует...";

        if (aiAnalysisContent) {
            aiAnalysisContent.innerHTML = `
    <div class="ai-loading">
        <span class="ai-loading-robot">🤖</span>

        <div>
            <strong>Городской советник анализирует сценарий...</strong>
            <p>
                Изучаем ваши решения, показатели районов
                и эффективность распределения бюджета.
            </p>
        </div>
    </div>
`;
        }

        try {

            // Собираем выбранные решения
            const decisions = selectedMeasures.map(selected => {

                const measure = measures.find(
                    item => item.id === selected.measureId
                );

                return {
                    id: selected.measureId,

                    name: measure
                        ? measure.name
                        : selected.measureId,

                    category: selected.category,

                    district: selected.district
                        ? districts[selected.district]?.name
                        : "Весь город",

                    cost: selected.cost
                };

            });


            // Формируем данные для AI
            const requestData = {

                decisions: decisions,

                result: {

                    baseScore:
                        lastSimulationResult.baseScore,

                    finalScore:
                        lastSimulationResult.finalScore,

                    improvement:
                        lastSimulationResult.improvement,

                    cityAverage:
                        lastSimulationResult.cityAverage,

                    weakestDistrictScore:
                        lastSimulationResult.weakestDistrictScore,

                    criticalCount:
                        lastSimulationResult.criticalCount,

                    districts:
                        lastSimulationResult.districts
                }
            };


            // Отправляем запрос серверу
            const response = await fetch(
                "http://localhost:3000/api/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(requestData)
                }
            );


            if (!response.ok) {

                let message =
                    `Ошибка сервера: ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    if (errorData.error) {
                        message = errorData.error;
                    }

                } catch (error) {
                    // Сервер вернул не JSON
                }

                throw new Error(message);
            }


            const data = await response.json();


            if (!data.analysis) {
                throw new Error(
                    "AI не вернул результат анализа."
                );
            }


            // Выводим результат
          if (aiAnalysisContent) {
    aiAnalysisContent.innerHTML =
        formatAIAnalysis(data.analysis);
}


        } catch (error) {

            console.error("Ошибка AI:", error);

            if (aiAnalysisContent) {

                aiAnalysisContent.textContent =
                    "Не удалось получить AI-анализ.\n\n" +
                    error.message;

            }

        } finally {

            aiAnalysisButton.disabled = false;

            aiAnalysisButton.textContent =
                oldButtonText;
        }

    });

}


// ======================================================
// НОВАЯ ИГРА
// ======================================================

if (newGameButton) {

    newGameButton.addEventListener("click", () => {

        completeCurrentLevel();

if (
    lastSimulationResult &&
    !checkLevelCompleted(lastSimulationResult)
) {
    return;
}

        // Очищаем выбранные решения
        selectedMeasures = [];

        // Возвращаем начальный район
        selectedDistrict = "nura";

        // Сбрасываем выбранную категорию
        currentCategory = null;

        // Сбрасываем результат предыдущей симуляции
        lastSimulationResult = null;

        // Скрываем результаты
        resultsScreen.classList.remove("active");

        // Показываем игровой экран
        gameScreen.classList.add("active");

        // Возвращаем категории
        if (categoriesView) {
            categoriesView.classList.remove("hidden");
        }

        // Скрываем список мероприятий
        if (measuresView) {
            measuresView.classList.remove("active");
        }

        // Сбрасываем выбранный район на карте
        districtButtons.forEach(button => {

            button.classList.remove("selected");

            if (button.dataset.district === selectedDistrict) {
                button.classList.add("selected");
            }

        });

        // Скрываем старый AI-анализ
        if (aiAnalysisBox) {
            aiAnalysisBox.style.display = "none";
        }

        // Удаляем старый текст AI
        if (aiAnalysisContent) {
            aiAnalysisContent.innerHTML = "";
        }

        // Обновляем данные района
        selectDistrict(selectedDistrict);

        // Обновляем бюджет, решения и интерфейс
        updateGameUI();

        // Возвращаем страницу наверх
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

// ВАЖНО: этот код уже был в файле.
// Его не удаляем.
});




// ======================================================
// НАСТРОЙКА ТЕКУЩЕГО УРОВНЯ
// ======================================================

function configureCurrentLevel() {

    currentLevel =
        gameLevels[career.level];


    MAX_BUDGET =
        currentLevel.baseBudget +
        career.bonusMoney;


    // Валидатор тоже должен знать новый бюджет
    simulationConfig.budget =
        MAX_BUDGET;


    console.log(
        `Уровень ${career.level}:`,
        currentLevel.name
    );

    console.log(
        `Бюджет: ${MAX_BUDGET}`
    );

}


// ======================================================
// ПРОВЕРКА ПРОХОЖДЕНИЯ УРОВНЯ
// ======================================================

function checkLevelCompleted(result) {

    const level =
        currentLevel;


    const scorePassed =
        result.finalScore >=
        level.targetScore;


    const criticalPassed =
        result.criticalCount <=
        level.maxCritical;


    const weakestPassed =
        level.minWeakestDistrict <= 0 ||
        result.weakestDistrictScore >=
        level.minWeakestDistrict;


    return (
        scorePassed &&
        criticalPassed &&
        weakestPassed
    );

}

// ======================================================
// ЗАВЕРШЕНИЕ УРОВНЯ
// ======================================================

function completeCurrentLevel() {

    if (!lastSimulationResult) {
        return;
    }


    const passed =
        checkLevelCompleted(
            lastSimulationResult
        );


    if (!passed) {

        alert(
            `❌ УРОВЕНЬ НЕ ПРОЙДЕН\n\n` +

            `Ваш Score: ` +
            `${lastSimulationResult.finalScore.toFixed(2)}\n` +

            `Нужно: ${currentLevel.targetScore}\n\n` +

            `Слабейший район: ` +
            `${lastSimulationResult.weakestDistrictScore.toFixed(2)}\n` +

            `Критических: ` +
            `${lastSimulationResult.criticalCount}\n\n` +

            `Попробуйте изменить решения.`
        );

        return;
    }


    // Сколько игрок потратил
    const spent =
        MAX_BUDGET -
        lastSimulationResult
            .validation
            .remainingBudget;


    // Сколько осталось
    const remaining =
        MAX_BUDGET - spent;


    // Награда уровня
    const reward =
        currentLevel.reward;


    // Бонус для следующего уровня:
    // остаток + награда
    career.bonusMoney =
        remaining +
        reward;


    const completedLevel =
        career.level;


    // Следующий уровень
    if (career.level < 5) {

        career.level++;

    }


    saveCareer();


    if (completedLevel < 5) {

        alert(
            `🎉 УРОВЕНЬ ${completedLevel} ПРОЙДЕН!\n\n` +

            `⭐ Score: ` +
            `${lastSimulationResult.finalScore.toFixed(2)}\n\n` +

            `💰 Осталось: ${remaining}\n` +

            `🏆 Награда: +${reward}\n\n` +

            `💵 Бонус следующего уровня: ` +
            `${career.bonusMoney}\n\n` +

            `🔓 Открыт уровень ${career.level}: ` +
            `${gameLevels[career.level].name}`
        );

    } else {

        alert(
            `👑 ПОЗДРАВЛЯЕМ!\n\n` +

            `Вы завершили карьеру акима!\n\n` +

            `Финальный Score: ` +
            `${lastSimulationResult.finalScore.toFixed(2)}`
        );

    }

};



