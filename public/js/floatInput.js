// This code keeps breaking when it was inputted in the main JS which is browser.js
// Then I decided to split it and it seems to work as intended now.. so there's that

// Variable for all .input-container
const floatContainer = document.querySelectorAll('.input-container');

// Iteration for every containered input with the class 'input-container'
floatContainer.forEach(element => {
    // Display for value if input already has it
    if (element.querySelector('input').value) {
        element.classList.add('active');
    }
    const handleFocus = (e) => {
        const target = e.target;
        // Add .active in the container and placeholder attribute in input tag
        target.parentNode.classList.add('active');
        target.setAttribute('placeholder', target.getAttribute('input-placeholder'));
    }
    const handleBlur = (e) => {
        const target = e.target;
        // Remove .active if it doesn't have any value inside it and placeholder attribute in input tag
        if(!target.value) {
            target.parentNode.classList.remove('active');
        }
        target.removeAttribute('placeholder')
    }
    // Variable for input that's in the container
    const floatInput = element.querySelector('input');
    // EventListener for every time input is focus and blur
    floatInput.addEventListener('focus', handleFocus)
    floatInput.addEventListener('blur', handleBlur)
});
