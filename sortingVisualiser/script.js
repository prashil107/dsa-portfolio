let array = [];
const arraySize = 10;
const delay = 50; // Delay in milliseconds

// Generate a random array
function generateArray() {
    alert ("Generating array..")
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    renderArray();
    displayArray("generated-array", array);
    displayArray("sorted-array", []);
}

// Display the array as text in a specific HTML element
function displayArray(elementId, arr) {
    const displayElement = document.getElementById(elementId);
    displayElement.textContent = arr.join(", ");
}

// Render the array as bars in the container
function renderArray() {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${array[i] * 3}px`;
        container.appendChild(bar);
    }
}

// Bubble Sort Algorithm Visualization
async function bubbleSort() {
    let bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                // Swap the elements
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j] * 3}px`;
                bars[j + 1].style.height = `${array[j + 1] * 3}px`;
                await delayTime(delay);
            }
        }
        bars[array.length - 1 - i].classList.add('sorted');
    }
    bars[0].classList.add('sorted');
    displayArray("sorted-array", array);
}

// Quick Sort Algorithm Visualization
async function quickSort(start = 0, end = array.length - 1) {
    if (start >= end) return;

    let index = await partition(start, end);
    await quickSort(start, index - 1);
    await quickSort(index + 1, end);

    if (start === 0 && end === array.length - 1) {
        displayArray("sorted-array", array);
    }
}

async function partition(start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];
    let bars = document.getElementsByClassName('bar');

    for (let i = start; i < end; i++) {
        if (array[i] < pivotValue) {
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            bars[i].style.height = `${array[i] * 3}px`;
            bars[pivotIndex].style.height = `${array[pivotIndex] * 3}px`;
            pivotIndex++;
            await delayTime(delay);
        }
    }
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    bars[pivotIndex].style.height = `${array[pivotIndex] * 3}px`;
    bars[end].style.height = `${array[end] * 3}px`;
    await delayTime(delay);

    bars[pivotIndex].classList.add('sorted');
    return pivotIndex;
}

// Helper function for delay
function delayTime(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to sort the array based on selected algorithm
function sortArray() {
    const algorithm = document.getElementById('algorithm').value;
    if (algorithm === 'bubbleSort') {
        bubbleSort();
    } else if (algorithm === 'quickSort') {
        quickSort();
    }
}

// Event listeners for buttons
document.getElementById('generate-button').addEventListener('click', generateArray);
document.getElementById('sort-button').addEventListener('click', sortArray);

// Generate array when the page loads
window.onload = generateArray;
