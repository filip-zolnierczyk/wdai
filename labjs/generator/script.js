document.getElementById('generate-password').addEventListener('click', () => {
    const minLength = parseInt(document.getElementById('min-length').value, 10);
    const maxLength = parseInt(document.getElementById('max-length').value, 10);
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeSpecial = document.getElementById('include-special').checked;

    if (minLength > maxLength) {
        alert('Minimalna długość nie może być większa od maksymalnej!');
        return;
    }

    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    const digits = '0123456789';

    let availableChars = lowerChars + digits;
    if (includeUppercase) availableChars += upperChars;
    if (includeSpecial) availableChars += specialChars;

    const passwordLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }

    alert(`Wygenerowane hasło: ${password}`);
});
