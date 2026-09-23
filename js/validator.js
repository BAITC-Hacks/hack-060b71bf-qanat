// ======================================================
// ASTANA CITY SIMULATOR
// VALIDATOR
// ======================================================

function validateScenario(selectedMeasures) {

    const errors = [];

    // ------------------------------------------
    // 1. Ровно 5 решений
    // ------------------------------------------

    if (
        selectedMeasures.length !==
        simulationConfig.requiredDecisions
    ) {
        errors.push(
            `Необходимо выбрать ровно ${simulationConfig.requiredDecisions} решений.`
        );
    }


    // ------------------------------------------
    // 2. Проверка бюджета
    // ------------------------------------------

    const totalCost =
        selectedMeasures.reduce(
            (sum, selected) => {

                const measure =
                    measures.find(
                        m =>
                            m.id ===
                            selected.measureId
                    );

                return (
                    sum +
                    (measure ? measure.cost : 0)
                );

            },
            0
        );


    if (
        totalCost >
        simulationConfig.budget
    ) {
        errors.push(
            `Бюджет превышен: ${totalCost}/${simulationConfig.budget}.`
        );
    }


    // ------------------------------------------
    // 3. Повторы
    // ------------------------------------------

    const ids =
        selectedMeasures.map(
            item =>
                item.measureId
        );


    const uniqueIds =
        new Set(ids);


    if (
        uniqueIds.size !==
        ids.length
    ) {
        errors.push(
            "Одно мероприятие нельзя выбирать несколько раз."
        );
    }


    // ------------------------------------------
    // 4. Район обязателен для district
    // ------------------------------------------

    selectedMeasures.forEach(
        selected => {

            const measure =
                measures.find(
                    m =>
                        m.id ===
                        selected.measureId
                );


            if (!measure) {

                errors.push(
                    `Неизвестное мероприятие ${selected.measureId}.`
                );

                return;
            }


            if (
                measure.type === "district" &&
                !selected.district
            ) {
                errors.push(
                    `${measure.id}: необходимо выбрать район.`
                );
            }


            if (
                measure.type === "city" &&
                selected.district
            ) {
                errors.push(
                    `${measure.id}: для городской меры район указывать нельзя.`
                );
            }

        }
    );


    // ------------------------------------------
    // 5. Максимум 2 меры направления
    // ------------------------------------------

    const categoryCounts = {};


    selectedMeasures.forEach(
        selected => {

            const measure =
                measures.find(
                    m =>
                        m.id ===
                        selected.measureId
                );


            if (!measure) {
                return;
            }


            if (
                !categoryCounts[
                    measure.category
                ]
            ) {
                categoryCounts[
                    measure.category
                ] = 0;
            }


            categoryCounts[
                measure.category
            ]++;

        }
    );


    Object.entries(
        categoryCounts
    ).forEach(
        ([category, count]) => {

            if (
                count >
                simulationConfig
                    .maxMeasuresPerCategory
            ) {
                errors.push(
                    `В направлении «${category}» выбрано больше двух мероприятий.`
                );
            }

        }
    );


    // ------------------------------------------
    // 6. Несовместимости
    // ------------------------------------------

    incompatibilities.forEach(
        rule => {

            const first =
                selectedMeasures.find(
                    item =>
                        item.measureId ===
                        rule.measures[0]
                );


            const second =
                selectedMeasures.find(
                    item =>
                        item.measureId ===
                        rule.measures[1]
                );


            if (
                !first ||
                !second
            ) {
                return;
            }


            // Глобальный конфликт
            // M1 + M3

            if (
                rule.sameDistrictOnly ===
                false
            ) {
                errors.push(
                    rule.message
                );

                return;
            }


            // Конфликт только в одном районе

            if (
                rule.sameDistrictOnly ===
                    true &&
                first.district ===
                    second.district
            ) {
                errors.push(
                    rule.message
                );
            }

        }
    );


    // ------------------------------------------
    // RESULT
    // ------------------------------------------

    return {

        valid:
            errors.length === 0,

        errors,

        totalCost,

        remainingBudget:
            simulationConfig.budget -
            totalCost

    };

}