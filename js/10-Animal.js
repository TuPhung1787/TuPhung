// JavaScript to handle section navigation
let currentSection = 0; // Initialize current section index

function showSection(offset) {
// Show the next or previous section based on the offset
    currentSection += offset;
    //This line retrieves all <section> elements within the container with the ID 'animalSections'
    const sections = document.getElementById('animalSections').getElementsByTagName('section');
// Ensure the index stays within bounds to move around the contents.
    if (currentSection < 0) {
        currentSection = sections.length - 1; // If at the beginning, go to the last section
    } else if (currentSection >= sections.length) {
        currentSection = 0; // If at the end, go to the first section
    }
    // Hide all sections before showing the current section
    Array.from(sections).forEach(section => section.style.display = 'none');
    // Showing the current section
    sections[currentSection].style.display = 'block';
}
// Show the first section initially
showSection(0);
