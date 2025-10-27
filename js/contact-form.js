document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                Accept: "application/json"
            }
        });

        if (response.ok) {
            alert("Заявка успешно отправлена!");
            form.reset();
        } else {
            const data = await response.json();
            alert(data.error || "Ошибка при отправке");
        }
    } catch (error) {
        alert("Ошибка соединения. Попробуйте позже.");
    }
});
