// ======================================================
// ASTANA CITY SIMULATOR
// SIMULATION ENGINE
// ======================================================


// ======================================================
// ОСНОВНАЯ ФУНКЦИЯ
// ======================================================

function simulateScenario(
    selectedMeasures
) {

    // Сначала валидируем

    const validation =
        validateScenario(
            selectedMeasures
        );


    if (!validation.valid) {

        return {
            success: false,
            validation
        };

    }


    // ------------------------------------------
    // Копируем исходные данные
    // ------------------------------------------

    const resultDistricts =
        JSON.parse(
            JSON.stringify(
                districts
            )
        );


    const contributions = [];


    // ------------------------------------------
    // Применяем мероприятия
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
                return;
            }


            const realization =
                (
                    simulationConfig.horizon -
                    measure.lag
                )
                /
                simulationConfig.horizon;


            // Районная мера

            if (
                measure.type ===
                "district"
            ) {

                applyMeasureToDistrict(
                    resultDistricts,
                    selected.district,
                    measure,
                    realization,
                    contributions
                );

            }


            // Городская мера

            else {

                Object.keys(
                    resultDistricts
                )
                .forEach(
                    districtId => {

                        applyMeasureToDistrict(
                            resultDistricts,
                            districtId,
                            measure,
                            realization,
                            contributions
                        );

                    }
                );

            }

        }
    );


    // ------------------------------------------
    // Синергии
    // ------------------------------------------

    applySynergies(
        resultDistricts,
        selectedMeasures,
        contributions
    );


    // ------------------------------------------
    // Clip 0-100
    // ------------------------------------------

    Object.values(
        resultDistricts
    )
    .forEach(
        district => {

            Object.keys(
                district.indicators
            )
            .forEach(
                indicator => {

                    district.indicators[
                        indicator
                    ] =
                        clip(
                            district.indicators[
                                indicator
                            ],
                            0,
                            100
                        );

                }
            );

        }
    );


    // ------------------------------------------
    // Пересчитываем D каждого района
    // ------------------------------------------

    Object.values(
        resultDistricts
    )
    .forEach(
        district => {

            district.newScore =
                calculateDistrictScore(
                    district.indicators
                );

        }
    );


    // ------------------------------------------
    // D_avg
    // ------------------------------------------

    let cityAverage = 0;


    Object.values(
        resultDistricts
    )
    .forEach(
        district => {

            cityAverage +=
                district.population *
                district.newScore;

        }
    );


    // ------------------------------------------
    // Минимальный район
    // ------------------------------------------

    const districtScores =
        Object.values(
            resultDistricts
        )
        .map(
            district =>
                district.newScore
        );


    const weakestDistrictScore =
        Math.min(
            ...districtScores
        );


    // ------------------------------------------
    // N_crit
    // строго меньше 40
    // ------------------------------------------

    let criticalCount = 0;


    Object.values(
        resultDistricts
    )
    .forEach(
        district => {

            Object.values(
                district.indicators
            )
            .forEach(
                value => {

                    if (
                        value <
                        simulationConfig
                            .criticalThreshold
                    ) {

                        criticalCount++;

                    }

                }
            );

        }
    );


    // ------------------------------------------
    // Финальный Score
    // ------------------------------------------

    const finalScore =
        (
            simulationConfig
                .scoreWeights
                .average
            *
            cityAverage
        )
        +
        (
            simulationConfig
                .scoreWeights
                .weakestDistrict
            *
            weakestDistrictScore
        )
        -
        (
            simulationConfig
                .scoreWeights
                .criticalPenalty
            *
            criticalCount
        );


    // ------------------------------------------
    // Результат
    // ------------------------------------------

    return {

        success: true,

        validation,

        districts:
            resultDistricts,

        contributions,

        cityAverage:
            round(cityAverage, 4),

        weakestDistrictScore:
            round(
                weakestDistrictScore,
                4
            ),

        criticalCount,

        baseScore:
            simulationConfig
                .baseScore,

        finalScore:
            round(
                finalScore,
                4
            ),

        improvement:
            round(
                finalScore -
                simulationConfig
                    .baseScore,
                4
            )

    };

}


// ======================================================
// ПРИМЕНИТЬ МЕРУ
// ======================================================

function applyMeasureToDistrict(
    resultDistricts,
    districtId,
    measure,
    realization,
    contributions
) {

    const district =
        resultDistricts[
            districtId
        ];


    if (!district) {
        return;
    }


    Object.entries(
        measure.effects
    )
    .forEach(
        ([indicator, fullEffect]) => {

            const realizedEffect =
                fullEffect *
                realization;


            district.indicators[
                indicator
            ] +=
                realizedEffect;


            contributions.push({

                type:
                    "measure",

                measureId:
                    measure.id,

                district:
                    districtId,

                indicator,

                fullEffect,

                realization,

                realizedEffect:
                    round(
                        realizedEffect,
                        4
                    )

            });

        }
    );

}


// ======================================================
// СИНЕРГИИ
// ======================================================

function applySynergies(
    resultDistricts,
    selectedMeasures,
    contributions
) {

    synergies.forEach(
        synergy => {

            const first =
                selectedMeasures.find(
                    item =>
                        item.measureId ===
                        synergy.measures[0]
                );


            const second =
                selectedMeasures.find(
                    item =>
                        item.measureId ===
                        synergy.measures[1]
                );


            if (
                !first ||
                !second
            ) {
                return;
            }


            const districtSource =
                selectedMeasures.find(
                    item =>
                        item.measureId ===
                        synergy
                            .districtMeasure
                );


            if (
                !districtSource ||
                !districtSource.district
            ) {
                return;
            }


            const districtId =
                districtSource.district;


            resultDistricts[
                districtId
            ]
            .indicators[
                synergy.indicator
            ] +=
                synergy.bonus;


            contributions.push({

                type:
                    "synergy",

                measures:
                    synergy.measures,

                district:
                    districtId,

                indicator:
                    synergy.indicator,

                realizedEffect:
                    synergy.bonus

            });

        }
    );

}


// ======================================================
// SCORE РАЙОНА
// ======================================================

function calculateDistrictScore(
    indicators
) {

    let score = 0;


    Object.entries(
        indicatorWeights
    )
    .forEach(
        ([indicator, weight]) => {

            score +=
                indicators[indicator]
                *
                weight;

        }
    );


    return score;

}


// ======================================================
// CLIP
// ======================================================

function clip(
    value,
    min,
    max
) {

    return Math.min(
        Math.max(
            value,
            min
        ),
        max
    );

}


// ======================================================
// ROUND
// ======================================================

function round(
    value,
    decimals = 2
) {

    const factor =
        10 ** decimals;


    return (
        Math.round(
            value *
            factor
        )
        /
        factor
    );

}