const fs = require('fs');

// Function to convert base-n number to decimal using BigInt for precision
function baseToDecimal(value, base) {
    const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = BigInt(0);
    const baseNum = BigInt(base);

    for (let i = 0; i < value.length; i++) {
        const digit = digits.indexOf(value[i].toLowerCase());
        if (digit === -1 || digit >= base) {
            throw new Error(`Invalid digit '${value[i]}' for base ${base}`);
        }
        result = result * baseNum + BigInt(digit);
    }

    return result;
}

// Function to implement Lagrange interpolation for finding polynomial constant
function lagrangeInterpolation(points, targetX = 0) {
    let result = BigInt(0);
    const n = points.length;
    const target = BigInt(targetX);

    for (let i = 0; i < n; i++) {
        let numerator = points[i].y;
        let denominator = BigInt(1);

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                numerator = numerator * (target - points[j].x);
                denominator = denominator * (points[i].x - points[j].x);
            }
        }

        // Perform exact division (should be exact for valid Shamir sharing)
        result += numerator / denominator;
    }

    return result;
}

// Main function to solve for polynomial constant 'c'
function findConstantC() {
    try {
        // Import JSON data
        const data = JSON.parse(fs.readFileSync('roots1.json', 'utf8'));

        const k = data.keys.k;
        const points = [];

        // Convert base-n values to decimal and create coordinate points
        for (let i = 1; i <= k; i++) {
            const x = BigInt(i);
            const baseValue = data[i.toString()];
            const base = parseInt(baseValue.base);
            const value = baseValue.value;

            const y = baseToDecimal(value, base);
            points.push({ x: x, y: y });
        }

        // Use Lagrange interpolation to find the constant term (f(0))
        const constantC = lagrangeInterpolation(points, 0);

        // Print only the constant 'c'
        console.log(constantC.toString());

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the solver
findConstantC();
