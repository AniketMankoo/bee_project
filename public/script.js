document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        var password = document.getElementById("password").value;
        var confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            event.preventDefault();
            alert("Passwords do not match!");
            return;
        }

        event.preventDefault();

        const formData = {
            personalInformation: {
                firstName: document.getElementById("fname").value,
                middleName: document.getElementById("mname").value,
                lastName: document.getElementById("lname").value,
                gender: document.querySelector('input[name="gender"]:checked').value,
                dob: document.getElementById("dob").value,
                phone: document.getElementById("phone").value
            },
            educationalInformation: {
                highestQualification: document.getElementById("education").value,
                fieldOfStudy: document.getElementById("field").value,
                university: document.getElementById("university").value,
                graduationYear: document.getElementById("year").value
            },
            address: {
                country: document.getElementById("country").value,
                state: document.getElementById("state").value,
                city: document.getElementById("city").value,
                pincode: document.getElementById("pincode").value,
                addressLine: document.getElementById("address").value
            },
            loginDetails: {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            }
        };

        fetch('http://localhost:3000/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                alert('Form submitted successfully!');
                location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    const countrySelect = document.getElementById("country");
    const stateSelect = document.getElementById("state");

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(countries => {
            const sortedCountries = countries.sort((a, b) => {
                const nameA = a.name.common.toUpperCase();
                const nameB = b.name.common.toUpperCase();
                return nameA.localeCompare(nameB);
            });

            sortedCountries.forEach(country => {
                const option = document.createElement("option");
                option.value = country.cca2;
                option.text = country.name.common;
                countrySelect.appendChild(option);
            });
        })
        .catch(err => console.error('Error loading countries:', err));

    fetch('/states.json')
        .then(response => response.json())
        .then(countryStateData => {
            countrySelect.addEventListener('change', function () {
                const selectedCountryCode = countrySelect.value;

                stateSelect.innerHTML = '<option value="">Select State</option>';

                if (selectedCountryCode && countryStateData[selectedCountryCode]) {
                    const selectedCountry = countryStateData[selectedCountryCode];
                    const sortedStates = selectedCountry.states.sort();

                    sortedStates.forEach(state => {
                        const option = document.createElement("option");
                        option.value = state;
                        option.text = state;
                        stateSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(err => console.error('Error loading states:', err));
});
