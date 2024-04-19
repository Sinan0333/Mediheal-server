export function generatePatientId(number:Number) {
    return `PAT${number.toString().padStart(2, '0')}`;
}