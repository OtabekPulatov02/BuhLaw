<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Получаем данные из формы
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$service = isset($_POST['service']) ? trim($_POST['service']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Валидация обязательных полей
if (empty($name) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Имя и телефон обязательны для заполнения']);
    exit;
}

// Валидация email (если указан)
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Некорректный email адрес']);
    exit;
}

// Настройки email
$to = 'pulatovotabek027@gmail.com';
$subject = 'Новая заявка с сайта BuhLaw';

// Формируем сообщение
$email_message = "
Новая заявка с сайта BuhLaw

Имя: $name
Телефон: $phone
Email: " . ($email ? $email : 'Не указан') . "
Услуга: $service
Сообщение: " . ($message ? $message : 'Не указано') . "

Дата отправки: " . date('Y-m-d H:i:s') . "
IP адрес: " . $_SERVER['REMOTE_ADDR'] . "
";

// Заголовки письма
$headers = "From: noreply@buhlaw.uz\r\n";
$headers .= "Reply-To: " . ($email ? $email : 'noreply@buhlaw.uz') . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Отправляем письмо
if (mail($to, $subject, $email_message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заявки. Попробуйте позже или свяжитесь с нами по телефону.']);
}
?>
