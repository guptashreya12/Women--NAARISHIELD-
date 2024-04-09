
document.addEventListener('DOMContentLoaded', function() {
    // Load existing contacts from local storage
    loadContacts();

    // Function to add a new row
    function addRow(name = '', phone = '', email = '') {
      const tbody = document.getElementById('contactsBody');
      const newRow = tbody.insertRow();
      newRow.innerHTML = `
        <td><input type="text" name="name[]" value="${name}" placeholder="Name" class="input-field" required /></td>
        <td><input type="tel" name="phone[]" value="${phone}" placeholder="Phone Number" class="input-field" required /></td>
        <td><input type="email" name="email[]" value="${email}" placeholder="Email" class="input-field" required /></td>
        <td><button type="button" class="removeRowBtn text-red-500 hover:text-red-700">Remove</button></td>
      `;

      // Add event listener for the remove button
      newRow.querySelector('.removeRowBtn').addEventListener('click', function() {
        newRow.remove();
        saveContacts();
      });
    }

    // Event listener for the add row button
    document.getElementById('addRowBtn').addEventListener('click', function() {
        addRow();
    });

    // Save contacts to local storage
    function saveContacts() {
        const allNames = document.querySelectorAll('input[name="name[]"]');
        const allPhones = document.querySelectorAll('input[name="phone[]"]');
        const allEmails = document.querySelectorAll('input[name="email[]"]');

        let contacts = [];
        allNames.forEach((el, index) => {
            contacts.push({
                name: el.value,
                phone: allPhones[index].value,
                email: allEmails[index].value
            });
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    // Load contacts from local storage and display
    function loadContacts() {
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.forEach(contact => {
            addRow(contact.name, contact.phone, contact.email);
        });
    }

    document.getElementById('sendEmailBtn').addEventListener('click', function() {
        sendLocationEmails(); // This function is called when the "Send Email" button is clicked
    });

    // Event listener for the form submit
    document.getElementById('contactsForm').addEventListener('submit', function(event) {
        event.preventDefault();
        saveContacts();
        alert('Contacts saved successfully!');
    });
});

navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    // Proceed to send this location via email
}, function(error) {
    console.error('Error occurred: ', error);
});
function sendLocationEmails() {
    navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        // Log the location URL to the console for debugging purposes
        console.log(`Location URL: ${locationUrl}`);
        
        // Alert the user with the location URL
        alert(`Your current location URL is: ${locationUrl}`);

        // The rest of your email sending logic...

         // Fetch stored contacts from local storage
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.forEach(contact => {
            const webAppUrl = 'https://script.google.com/macros/s/AKfycby7ES6xeAlC1lonH3AgA0w_raJE5-BuPgOxGZLKikVSQYucio50chhz1k5-yKYvMQ8s/exec'; // Replace this with your actual Google Apps Script web app URL
            fetch(webAppUrl, {
                method: 'POST',
                mode: 'no-cors', // This is needed to avoid CORS errors, but you won't be able to read the response
                body: JSON.stringify({
                    email: contact.email,
                    subject: 'My Current Location',
                    body: `Here is my current location: ${locationUrl}`
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(() => console.log('Email sent successfully to ' + contact.email))
            .catch(error => console.error('Error sending email to ' + contact.email, error));
        });
    
    }, function(error) {
        console.error('Error getting location', error);
        alert('Error getting location: ' + error.message);
    });
}



// Function to send email
// Function to send email to contacts with the user's location
// function sendLocationEmails() {
//     navigator.geolocation.getCurrentPosition(function(position) {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    
//         // Fetch stored contacts from local storage
//         const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
//         contacts.forEach(contact => {
//             const webAppUrl = 'https://script.google.com/macros/s/AKfycby7ES6xeAlC1lonH3AgA0w_raJE5-BuPgOxGZLKikVSQYucio50chhz1k5-yKYvMQ8s/exec'; // Replace this with your actual Google Apps Script web app URL
//             fetch(webAppUrl, {
//                 method: 'POST',
//                 mode: 'no-cors', // This is needed to avoid CORS errors, but you won't be able to read the response
//                 body: JSON.stringify({
//                     email: contact.email,
//                     subject: 'My Current Location',
//                     body: `Here is my current location: ${locationUrl}`
//                 }),
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//             })
//             .then(() => console.log('Email sent successfully to ' + contact.email))
//             .catch(error => console.error('Error sending email to ' + contact.email, error));
//         });
    
//         alert('Location shared with contacts successfully!');
//     }, function(error) {
//         console.error('Error getting location', error);
//     });
// }