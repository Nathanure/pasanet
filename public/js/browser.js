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

// Input increment and decrement
document.addEventListener("DOMContentLoaded", function() {
    function addEvents() {
        const product = JSON.parse(window.productData);
        product.forEach(function(item) {
            const minusBtn = document.getElementById(`minus-btn-${item.product_id}`);
            const plusBtn = document.getElementById(`plus-btn-${item.product_id}`);
            const input = document.getElementById(`item-${item.product_id}`);
            minusBtn.addEventListener("click", function() {
                input.value = Math.max(parseInt(input.value) - 1, 0);
            });
            plusBtn.addEventListener("click", function() {
                input.value = Math.min(parseInt(input.value) + 1, 100);
            });
        });
    }
    addEvents();
});

// const minusBtn = document.querySelector('.minus-btn');
// const plusBtn = document.querySelector('.plus-btn');
// const putBtn = document.getElementById('put-btn');

// minusBtn.addEventListener('click', decrementValue);
// plusBtn.addEventListener('click', incrementValue);
// putBtn.addEventListener('click', sendData);
// var value = parseInt(document.getElementById('item').value, 10);

// function decrementValue() {
//     value = isNaN(value) ? 0 : value;
//     value < 1 ? value = 1 : '';
//     value--;
//     document.getElementById('item').value = value;
// }

// function incrementValue() {
//     value = isNaN(value) ? 0 : value;
//     if (value >= 100) {
//         value = 99;
//     } else if (value < 100) {
//         value++;
//     }
//     document.getElementById('item').value = value;
// }

function sendData() {
    if (value > 0) {
        let price = document.getElementById('price').innerText;
        let data = {
            name: document.getElementById('name').innerText,
            sold: document.getElementById('item').value,
            price: price.replace('.', '')
        }
        console.log(data);
        var json = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', '/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
            } else {
                console.error(xhr.responseText);
            }
        };
        xhr.send(json);
    }
}

// Number only with text input
document.getElementById("stock").addEventListener("input", function () {
    // RegExp for number between 0-9 only
    this.value = this.value.replace(/[^0-9]/g, '');
});
