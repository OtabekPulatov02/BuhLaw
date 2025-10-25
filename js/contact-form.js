document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        
        // Скрываем предыдущие сообщения
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';

        // Собираем данные формы
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch('send_email.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Показываем сообщение об успехе
                if (successMessage) {
                    successMessage.textContent = result.message;
                    successMessage.style.display = 'block';
                    successMessage.style.color = '#14b8a6';
                    successMessage.style.backgroundColor = '#f0fdfa';
                    successMessage.style.border = '1px solid #14b8a6';
                    successMessage.style.padding = '15px';
                    successMessage.style.borderRadius = '8px';
                    successMessage.style.marginTop = '20px';
                }
                
                // Очищаем форму
                contactForm.reset();
                
                // Прокручиваем к сообщению
                if (successMessage) {
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Показываем сообщение об ошибке
                if (errorMessage) {
                    errorMessage.textContent = result.message;
                    errorMessage.style.display = 'block';
                    errorMessage.style.color = '#dc2626';
                    errorMessage.style.backgroundColor = '#fef2f2';
                    errorMessage.style.border = '1px solid #dc2626';
                    errorMessage.style.padding = '15px';
                    errorMessage.style.borderRadius = '8px';
                    errorMessage.style.marginTop = '20px';
                }
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            if (errorMessage) {
                errorMessage.textContent = 'Произошла ошибка при отправке заявки. Попробуйте позже или свяжитесь с нами по телефону.';
                errorMessage.style.display = 'block';
                errorMessage.style.color = '#dc2626';
                errorMessage.style.backgroundColor = '#fef2f2';
                errorMessage.style.border = '1px solid #dc2626';
                errorMessage.style.padding = '15px';
                errorMessage.style.borderRadius = '8px';
                errorMessage.style.marginTop = '20px';
            }
        } finally {
            // Восстанавливаем кнопку
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
        }
    });

    // Валидация формы в реальном времени
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    if (nameInput) {
        nameInput.addEventListener('blur', validateName);
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', validatePhone);
    }

    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }

    function validateName() {
        const name = nameInput.value.trim();
        if (name.length < 2) {
            showFieldError(nameInput, 'Имя должно содержать минимум 2 символа');
            return false;
        } else {
            clearFieldError(nameInput);
            return true;
        }
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            showFieldError(phoneInput, 'Введите корректный номер телефона');
            return false;
        } else {
            clearFieldError(phoneInput);
            return true;
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError(emailInput, 'Введите корректный email адрес');
            return false;
        } else {
            clearFieldError(emailInput);
            return true;
        }
    }

    function showFieldError(input, message) {
        clearFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc2626';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '5px';
        
        input.style.borderColor = '#dc2626';
        input.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(input) {
        input.style.borderColor = '';
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
});
