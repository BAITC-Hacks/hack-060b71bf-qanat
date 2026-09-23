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

    const MAX_BUDGET = simulationConfig.budget;
    const MAX_DECISIONS = simulationConfig.requiredDecisions;


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


    // ==================================================
    // ГЛАВНАЯ → ИГРА
    // ==================================================

    if (startButton) {

        startButton.addEventListener("click", () => {

            homeScreen.style.display = "none";
            gameScreen.classList.add("active");

            selectDistrict(selectedDistrict);
            updateGameUI();

            window.scrollTo(0, 0);

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

    showResults(result);

});


// ==================================================
// ПОКАЗАТЬ ЭКРАН РЕЗУЛЬТАТОВ
// ==================================================

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

});