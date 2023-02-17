// Function for mask and unmask on sensitive string
$(document).ready(function () {
    $("#show_hide_password button").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_password input').attr("type") == "text") {
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass("bi-eye-slash-fill");
            $('#show_hide_password i').removeClass("bi-eye-fill");
        } else if ($('#show_hide_password input').attr("type") == "password") {
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass("bi-eye-slash-fill");
            $('#show_hide_password i').addClass("bi-eye-fill");
        }
    });
});
$(document).ready(function () {
    $("#show_hide_confirm_password button").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_confirm_password input').attr("type") == "text") {
            $('#show_hide_confirm_password input').attr('type', 'password');
            $('#show_hide_confirm_password i').addClass("bi-eye-slash-fill");
            $('#show_hide_confirm_password i').removeClass("bi-eye-fill");
        } else if ($('#show_hide_confirm_password input').attr("type") == "password") {
            $('#show_hide_confirm_password input').attr('type', 'text');
            $('#show_hide_confirm_password i').removeClass("bi-eye-slash-fill");
            $('#show_hide_confirm_password i').addClass("bi-eye-fill");
        }
    });
});

// Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Call the dataTables jQuery plugin
$(document).ready(function () {
    $('#dataTable').DataTable();
});

// Datatables for dashboard
window.addEventListener('DOMContentLoaded', event => {
    const dataAdmin = document.getElementById('dataAdmin');
    const dataUser = document.getElementById('dataUser');
    const genData = document.getElementById('generalData');
    if (dataAdmin) new simpleDatatables.DataTable(dataAdmin);
    if (dataUser) new simpleDatatables.DataTable(dataUser);
    if (genData) new simpleDatatables.DataTable(genData);
});

// Toggle the side navigation
window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // To persist sidebar toggle between refreshes
        if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            document.body.classList.toggle('sb-sidenav-toggled');
        }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});

// Input in card
function addEvents() {
    // Find all cards on the page
    const cards = document.querySelectorAll('.card');

    // Loop through each card
    cards.forEach(card => {
        // Find the plus and minus buttons for this card
        const minusBtn = card.querySelector('.minus-btn');
        const plusBtn = card.querySelector('.plus-btn');
        const input = card.querySelector('.quantity');
        const putBtn = card.querySelector('.put-btn');
        const alert = card.querySelector('.alert-btn')
        const alertMessage = card.querySelector('.alert-message');
        // Object datas
        const user_id = card.querySelector('.id-user');
        const product_id = card.querySelector('.id');
        const name = card.querySelector('.name');
        const price = card.querySelector('.price');

        // Add a click event listener to the minus button
        minusBtn.addEventListener("click", function () {
            // Decrement the quantity
            if (input.value > 0) input.value--;
        });

        // Add a click event listener to the plus button
        plusBtn.addEventListener("click", function () {
            // Increment the quantity
            if (input.value < 99) input.value++;
        });


        if (alert) {
            let flag = false;
            alert.addEventListener("click", function () {
                if (flag) {
                    return;
                }
                flag = true;
                const message = 'You need to login first!';
                const type = 'danger';
    
                // Create the alert message
                const wrapper = document.createElement('div');
                wrapper.innerHTML = [
                    `<div class="d-flex align-items-center px-3 justify-content-between alert alert-${type} alert-dismissible alert-message-buffer fixed-top mx-auto m-5 w-50" role="alert">`,
                    '    <div class="d-flex align-items-center gap-3 ms-2">',
                    '        <div class="loading">',
                    '            <div class="spinner-border text-primary" role="status">',
                    '                <span class="sr-only">Loading...</span>',
                    '            </div>',
                    '        </div>',
                    '        <div class="d-grid">',
                    `            ${message}`,
                    '            <div class="small">Redirecting you to login...</div>',
                    '        </div>',
                    '    </div>',
                    '    <button type="button" class="position-relative btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('');
    
                alertMessage.append(wrapper);
                alertMessage.classList.add('alert-message-buffer');

                setTimeout(() => {
                    wrapper.remove();
                    flag = false;
                    window.location='/login';
                }, 4000);
            })
        }

        if (putBtn) {
            // Add a click event listener to the put button
            putBtn.addEventListener("click", function () {
                // Pass data to server
                let json = JSON.stringify({
                    user_id: user_id.innerText,
                    product_id: product_id.innerText,
                    name: name.innerText,
                    quantity: Number(input.value),
                    price: Number(price.innerText.substring(2))
                })
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', '/');
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                xhr.send(json);
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", addEvents);

const stock = document.getElementById("stock");
if (stock) {
    // Number only with text input
    stock.addEventListener("input", function () {
        // RegExp for number between 0-9 only
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

const imageCarousel = document.getElementById("image");
if (imageCarousel) {
    imageCarousel.addEventListener("click", function() {
        this.classList.toggle("blurred");
    });
}

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
