document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('nav-links')?.classList.toggle('active');
});
let currentUnit = 'metric';

const KG_TO_LBS = 2.20462;
const CM_TO_INCHES = 0.393701;
function toggleUnits() {
    const weightInput = document.getElementById('weight');
    const heightCmInput = document.getElementById('height');
    const heightFt = document.getElementById('height-feet');
    const heightIn = document.getElementById('height-inches');
    const weightUnit = document.getElementById('weight-unit');
    const heightUnit = document.getElementById('height-unit');
    const metricBtn = document.getElementById('metric-btn');
    const imperialBtn = document.getElementById('imperial-btn');
    if (currentUnit === 'metric') {
        currentUnit = 'imperial';
        const kg = parseFloat(weightInput.value) || 70;
        weightInput.value = (kg * KG_TO_LBS).toFixed(1);
        weightUnit.textContent = '(lbs)';
        const cm = parseFloat(heightCmInput.value) || 175;
        const totalInches = cm * CM_TO_INCHES;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        heightFt.value = feet;
        heightIn.value = inches;
        document.getElementById('height-wrapper').style.display = 'none';
        document.getElementById('height-ft-in').style.display = 'flex';
        heightUnit.textContent = '';

        metricBtn.classList.remove('active');
        imperialBtn.classList.add('active');
    } else {
        currentUnit = 'metric';
        const lbs = parseFloat(weightInput.value) || 154;
        weightInput.value = (lbs / KG_TO_LBS).toFixed(1);
        weightUnit.textContent = '(kg)';
        const feet = parseInt(heightFt.value) || 5;
        const inches = parseInt(heightIn.value) || 9;
        const totalInches = (feet * 12) + inches;
        const cm = Math.round(totalInches / CM_TO_INCHES);
        heightCmInput.value = cm;
        document.getElementById('height-wrapper').style.display = 'block';
        document.getElementById('height-ft-in').style.display = 'none';
        heightUnit.textContent = '(cm)';

        imperialBtn.classList.remove('active');
        metricBtn.classList.add('active');
    }
}
document.getElementById('metric-btn')?.addEventListener('click', toggleUnits);
document.getElementById('imperial-btn')?.addEventListener('click', toggleUnits);
function getWeightKg() {
    const value = parseFloat(document.getElementById('weight').value) || 0;
    return currentUnit === 'metric' ? value : value / KG_TO_LBS;
}

function getHeightCm() {
    if (currentUnit === 'metric') {
        return parseFloat(document.getElementById('height').value) || 0;
    } else {
        const feet = parseInt(document.getElementById('height-feet').value) || 0;
        const inches = parseInt(document.getElementById('height-inches').value) || 0;
        const totalInches = (feet * 12) + inches;
        return totalInches / CM_TO_INCHES;
    }
}
const GOAL_ADJUSTMENTS = {
    cut: { delta: -500, label: 'Cutting (Deficit)', description: 'Moderate fat-loss calories' },
    maintain: { delta: 0, label: 'Maintenance', description: 'Stay at your current weight' },
    bulk: { delta: 500, label: 'Bulking (Surplus)', description: 'Moderate muscle-gain calories' }
};

function calculateBMR(weightKg, heightCm, age, gender, bodyFat) {
    let bmr, formula;
    if (bodyFat && bodyFat >= 5 && bodyFat <= 60) {
        const lbm = weightKg * (1 - bodyFat / 100);
        bmr = 370 + (21.6 * lbm);
        formula = "Katch-McArdle (with body fat %)";
    } else {
        bmr = gender === 'male'
            ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
            : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        formula = "Mifflin-St Jeor";
    }
    return { bmr: Math.round(bmr), formula };
}

function calculateCalories() {
    const weightKg = getWeightKg();
    const heightCm = getHeightCm();
    const age = parseFloat(document.getElementById('age').value) || 0;
    const gender = document.getElementById('gender').value;
    const bodyFat = parseFloat(document.getElementById('bodyFat').value) || null;
    const activity = parseFloat(document.getElementById('activity').value);
    const goal = document.getElementById('goal').value;

    if (!weightKg || !heightCm || !age) {
        if (document.activeElement === document.getElementById('calculate-btn')) {
            alert("Please fill in Weight, Height, and Age.");
        }
        return;
    }
    const { bmr, formula } = calculateBMR(weightKg, heightCm, age, gender, bodyFat);
    const tdee = Math.round(bmr * activity);
    const goalCals = tdee + GOAL_ADJUSTMENTS[goal].delta;
    document.getElementById('tdee-result').textContent = tdee.toLocaleString();
    document.getElementById('goal-calories-result').textContent = goalCals.toLocaleString();
    document.getElementById('goal-label').textContent = GOAL_ADJUSTMENTS[goal].label;
    document.getElementById('goal-description').textContent = GOAL_ADJUSTMENTS[goal].description;
    document.getElementById('formula-used').textContent = `Formula: ${formula}`;
    document.getElementById('bmr-text').textContent = `BMR: ${bmr.toLocaleString()} kcal`;
    document.getElementById('multiplier-text').textContent = `Activity: ×${activity}`;

    document.getElementById('results').classList.remove('hidden');
    document.querySelectorAll('.step').forEach(s => s.classList.add('active'));
}
document.getElementById('calculate-btn')?.addEventListener('click', calculateCalories);
window.addEventListener('load', calculateCalories);
