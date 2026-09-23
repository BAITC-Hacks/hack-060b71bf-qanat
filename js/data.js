// ======================================================
// ASTANA CITY SIMULATOR
// DATA
// ======================================================


// ======================================================
// 1. РАЙОНЫ
// ======================================================

const districts = {

    esil: {
        name: "Есиль",
        population: 0.27,
        score: 62.99,

        profile:
            "Богатый район, но с пробками на мостах и переполненными школами.",

        indicators: {
            T1: 45,
            T2: 62,
            E1: 68,
            E2: 72,
            S1: 48,
            S2: 55,
            B1: 78,
            B2: 60,
            C1: 75,
            C2: 70
        }
    },


    almaty: {
        name: "Алматы",
        population: 0.24,
        score: 57.06,

        profile:
            "Район со старой инфраструктурой ЖКХ и транспортными проблемами.",

        indicators: {
            T1: 40,
            T2: 75,
            E1: 50,
            E2: 55,
            S1: 60,
            S2: 65,
            B1: 62,
            B2: 52,
            C1: 50,
            C2: 60
        }
    },


    saryarka: {
        name: "Сарыарка",
        population: 0.20,
        score: 54.65,

        profile:
            "Основные проблемы — качество воздуха и недостаток озеленения.",

        indicators: {
            T1: 50,
            T2: 70,
            E1: 42,
            E2: 40,
            S1: 62,
            S2: 68,
            B1: 58,
            B2: 55,
            C1: 45,
            C2: 55
        }
    },


    baikonur: {
        name: "Байконур",
        population: 0.13,
        score: 56.63,

        profile:
            "Сбалансированный район без ярко выраженных перекосов.",

        indicators: {
            T1: 52,
            T2: 68,
            E1: 55,
            E2: 50,
            S1: 58,
            S2: 60,
            B1: 52,
            B2: 58,
            C1: 55,
            C2: 58
        }
    },


    nura: {
        name: "Нура",
        population: 0.16,
        score: 49.18,

        profile:
            "Главный проблемный район по социальной инфраструктуре и транспорту.",

        indicators: {
            T1: 55,
            T2: 40,
            E1: 45,
            E2: 65,
            S1: 38,
            S2: 35,
            B1: 55,
            B2: 50,
            C1: 60,
            C2: 50
        }
    }

};


// ======================================================
// 2. НАЗВАНИЯ ПОКАЗАТЕЛЕЙ
// ======================================================

const indicatorNames = {

    T1: "Разгрузка дорог",
    T2: "Общественный транспорт",

    E1: "Озеленение",
    E2: "Качество воздуха",

    S1: "Школы и детсады",
    S2: "Медицина",

    B1: "Безопасность улиц",
    B2: "Безопасность дорожного движения",

    C1: "Надёжность ЖКХ",
    C2: "Решение обращений жителей"

};


// ======================================================
// 3. ВЕСА ПОКАЗАТЕЛЕЙ
// ======================================================

const indicatorWeights = {

    T1: 0.10,
    T2: 0.10,

    E1: 0.09,
    E2: 0.11,

    S1: 0.11,
    S2: 0.11,

    B1: 0.09,
    B2: 0.09,

    C1: 0.10,
    C2: 0.10

};


// ======================================================
// 4. МЕРОПРИЯТИЯ M1-M14
// ======================================================

const measures = [

    // ---------------- TRANSPORT ----------------

    {
        id: "M1",
        category: "transport",
        categoryName: "Транспорт",
        icon: "🚌",

        name:
            "Выделенные полосы для автобусов",

        type: "district",

        cost: 18,
        lag: 2,

        effects: {
            T1: 6,
            T2: 9
        }
    },


    {
        id: "M2",
        category: "transport",
        categoryName: "Транспорт",
        icon: "🚦",

        name:
            "Умные светофоры",

        type: "city",

        cost: 22,
        lag: 2,

        effects: {
            T1: 4,
            B2: 3
        }
    },


    {
        id: "M3",
        category: "transport",
        categoryName: "Транспорт",
        icon: "🚈",

        name:
            "Линия ЛРТ / расширение",

        type: "district",

        cost: 30,
        lag: 4,

        effects: {
            T1: 16,
            T2: 20,
            E2: 4
        }
    },


    // ---------------- ECOLOGY ----------------

    {
        id: "M4",
        category: "ecology",
        categoryName: "Экология",
        icon: "🌳",

        name:
            "Парк / сквер",

        type: "district",

        cost: 15,
        lag: 2,

        effects: {
            E1: 12,
            E2: 3,
            B1: 2
        }
    },


    {
        id: "M5",
        category: "ecology",
        categoryName: "Экология",
        icon: "🌱",

        name:
            "Перевод частного сектора на чистое топливо",

        type: "district",

        cost: 25,
        lag: 3,

        effects: {
            E2: 14,
            C1: 4
        }
    },


    {
        id: "M6",
        category: "ecology",
        categoryName: "Экология",
        icon: "🌲",

        name:
            "Городская программа озеленения и ветрозащитных полос",

        type: "city",

        cost: 20,
        lag: 4,

        effects: {
            E1: 5,
            E2: 3
        }
    },


    // ---------------- SOCIAL ----------------

    {
        id: "M7",
        category: "social",
        categoryName: "Соцсфера",
        icon: "🏫",

        name:
            "Школа + детсад",

        type: "district",

        cost: 24,
        lag: 3,

        effects: {
            S1: 16
        }
    },


    {
        id: "M8",
        category: "social",
        categoryName: "Соцсфера",
        icon: "🏥",

        name:
            "Центр семейного здоровья / поликлиника",

        type: "district",

        cost: 20,
        lag: 3,

        effects: {
            S2: 14
        }
    },


    {
        id: "M9",
        category: "social",
        categoryName: "Соцсфера",
        icon: "⚽",

        name:
            "Дворовые спорт-хабы",

        type: "district",

        cost: 10,
        lag: 1,

        effects: {
            S1: 3,
            S2: 3,
            B1: 3
        }
    },


    // ---------------- SAFETY ----------------

    {
        id: "M10",
        category: "safety",
        categoryName: "Безопасность",
        icon: "📹",

        name:
            "Освещение и камеры Safe City",

        type: "district",

        cost: 12,
        lag: 1,

        effects: {
            B1: 12,
            B2: 2
        }
    },


    {
        id: "M11",
        category: "safety",
        categoryName: "Безопасность",
        icon: "🚸",

        name:
            "Безопасные переходы и школьные зоны",

        type: "district",

        cost: 10,
        lag: 1,

        effects: {
            B2: 12,
            T1: -2
        }
    },


    // ---------------- SERVICES ----------------

    {
        id: "M12",
        category: "services",
        categoryName: "Сервисы",
        icon: "💻",

        name:
            "Единая цифровая платформа обращений",

        type: "city",

        cost: 14,
        lag: 1,

        effects: {
            C2: 5
        }
    },


    {
        id: "M13",
        category: "services",
        categoryName: "Сервисы",
        icon: "🔧",

        name:
            "Модернизация тепло- и водосетей",

        type: "district",

        cost: 28,
        lag: 4,

        effects: {
            C1: 18,
            E2: 2
        }
    },


    {
        id: "M14",
        category: "services",
        categoryName: "Сервисы",
        icon: "🚨",

        name:
            "Аварийные бригады ЖКХ + раннее оповещение",

        type: "city",

        cost: 16,
        lag: 1,

        effects: {
            C1: 5,
            C2: 2
        }
    }

];


// ======================================================
// 5. СИНЕРГИИ
// ======================================================

const synergies = [

    {
        measures: ["M1", "M2"],
        indicator: "T1",
        bonus: 2,

        // Бонус применяется в районе M1
        districtMeasure: "M1"
    },


    {
        measures: ["M10", "M12"],
        indicator: "B1",
        bonus: 2,

        // Бонус применяется в районе M10
        districtMeasure: "M10"
    },


    {
        measures: ["M5", "M6"],
        indicator: "E2",
        bonus: 2,

        // Бонус применяется в районе M5
        districtMeasure: "M5"
    }

];


// ======================================================
// 6. НЕСОВМЕСТИМОСТИ
// ======================================================

const incompatibilities = [

    // M1 и M3 нельзя выбирать одновременно вообще.
    {
        measures: ["M1", "M3"],
        sameDistrictOnly: false,

        message:
            "Нельзя одновременно выбрать выделенные автобусные полосы (M1) и ЛРТ (M3)."
    },


    // M4 и M7 нельзя только В ОДНОМ районе.
    {
        measures: ["M4", "M7"],
        sameDistrictOnly: true,

        message:
            "Парк (M4) и школа + детсад (M7) нельзя разместить в одном районе."
    },


    // M5 и M13 нельзя только В ОДНОМ районе.
    {
        measures: ["M5", "M13"],
        sameDistrictOnly: true,

        message:
            "Чистое топливо (M5) и модернизацию сетей (M13) нельзя выбрать для одного района."
    }

];


// ======================================================
// 7. ОСНОВНЫЕ НАСТРОЙКИ СИМУЛЯЦИИ
// ======================================================

const simulationConfig = {

    budget: 100,

    requiredDecisions: 5,

    horizon: 8,

    maxMeasuresPerCategory: 2,

    baseScore: 52.56,

    criticalThreshold: 40,

    scoreWeights: {
        average: 0.7,
        weakestDistrict: 0.3,
        criticalPenalty: 1
    }

};