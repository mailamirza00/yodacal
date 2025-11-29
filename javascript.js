// Hamburger menu
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('active');
});

// Goal adjustments
const GOAL_ADJUSTMENTS = {
    cut:      { delta: -500, label: 'Cutting (Deficit)',      description: 'Moderate fat-loss calories' },
    maintain: { delta: 0,    label: 'Maintenance',            description: 'Stay at your current weight' },
    bulk:     { delta: 500,  label: 'Bulking (Surplus)',      description: 'Moderate muscle-gain calories' }
};

function calculateBMR(weight, height, age, gender, bodyFat) {
    let bmr, formula;
    if (bodyFat && bodyFat >= 5 && bodyFat <= 60) {
        // Katch-McArdle Formula
        const lbm = weight * (1 - bodyFat / 100);
        bmr = 370 + (21.6 * lbm);
        formula = "Katch-McArdle (with body fat %)";
    } else {
        // Mifflin-St Jeor Formula
        bmr = gender === 'male'
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;
        formula = "Mifflin-St Jeor";
    }
    return { bmr: Math.round(bmr), formula };
}

function calculateCalories() {
    // 1. Get Values
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const age    = parseFloat(document.getElementById('age').value) || 0;
    const gender = document.getElementById('gender').value;
    const bf     = parseFloat(document.getElementById('bodyFat').value) || null;
    const mult   = parseFloat(document.getElementById('activity').value);
    const goal   = document.getElementById('goal').value;

    if (weight <= 0 || height <= 0 || age <= 0) {
        // Only alert if the button is clicked and values are invalid
        if (document.activeElement === document.getElementById('calculate-btn')) {
             alert("Please enter valid positive numbers for Weight, Height, and Age.");
        }
        return; // Stop function execution if data is invalid
    }

    // 2. Calculate BMR and TDEE
    const { bmr, formula } = calculateBMR(weight, height, age, gender, bf);
    const tdee = Math.round(bmr * mult);
    
    // 3. Apply Goal Adjustment
    const goalData = GOAL_ADJUSTMENTS[goal];
    const goalCals = tdee + goalData.delta;

    // 4. Update and Show Results
    document.getElementById('tdee-result').textContent = tdee.toLocaleString();
    document.getElementById('goal-calories-result').textContent = goalCals.toLocaleString();
    
    document.getElementById('goal-label').textContent = goalData.label;
    document.getElementById('goal-description').textContent = goalData.description;
    
    document.getElementById('formula-used').textContent = `Formula used: ${formula}`;
    document.getElementById('bmr-text').textContent = `BMR: ${bmr.toLocaleString()} kcal`;
    document.getElementById('multiplier-text').textContent = `Activity multiplier: ${mult}`;

    document.getElementById('results').classList.remove('hidden');
    document.querySelectorAll('.step').forEach(s => s.classList.add('active'));
}

// Attach click event for calculation
document.getElementById('calculate-btn').addEventListener('click', calculateCalories);

// Run on load to display results with default values (optional, based on your original code)
window.addEventListener('load', calculateCalories);
