<?php
// ====================================
// CONFIGURACIÓN INICIAL
// ====================================

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// RUTAS A PHPMailer - Ajusta según dónde tengas PHPMailer
require __DIR__ . '/PHPMailer-master/src/PHPMailer.php';
require __DIR__ . '/PHPMailer-master/src/SMTP.php';
require __DIR__ . '/PHPMailer-master/src/Exception.php';

// CREDENCIALES SMTP
$smtpHost = 'mail.zerotoplan.com';
$smtpUser = 'no-reply@zerotoplan.com';
$smtpPass = '5)}dQ&%jli4j!8bc'; // cámbiala por la real
$smtpPort = 465; // o 587 si usas STARTTLS

// ====================================
// CONEXIÓN A LA BASE DE DATOS
// ====================================
$host = 'localhost';
$dbname = 'zero9111_landing';
$username = 'zero9111_jesusrey';
$password = 'o+[ZdH33O£RhD2/';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("❌ Database connection error: " . $e->getMessage());
}

// ====================================
// PROCESAMIENTO DEL FORMULARIO
// ====================================
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // --- Anti-bot honeypot ---
    if (!empty($_POST['website'])) {
        die('Bot detected. Submission blocked.');
    }

    $timestamp = 0;
    if (isset($_POST["timestamp"]) && is_numeric($_POST["timestamp"])) {
        $timestamp = (int) $_POST["timestamp"];
    }

    // Calcula diferencia absoluta en segundos
    $delta = abs(time() - $timestamp);

    // Si el timestamp no existe, es menor a 3 segundos, o tiene más de 24 h → sospechoso
    if ($timestamp === 0 || $delta < 3 || $delta > 86400) {
        die("Suspiciously fast submission. Possible bot detected.");
    }

    $name        = trim($_POST["name"] ?? "");
    $email       = trim($_POST["email"] ?? "");
    $phone       = trim($_POST["phone"] ?? "");

    // Validar email real
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>alert('Please enter a valid email address.'); window.history.back();</script>";
        exit;
    }

    if ($name && $email) {
        // 1. PROCESO DE BASE DE DATOS
        $dbError = null;
        try {
            $stmt = $pdo->prepare("
                INSERT INTO onv_newsletter (name, email, phone, subscribed_at)
                VALUES (:name, :email, :phone, NOW())
            ");
            $stmt->execute([
                ":name" => $name,
                ":email" => $email,
                ":phone" => $phone
            ]);
        } catch (PDOException $e) {
            $dbError = $e->getMessage();
            error_log("❌ Database Error: " . $dbError);
        }

        // 2. PROCESO DE CORREO (Independiente con PHPMailer)
        $mailError = null;
        try {
            // ====================================
            // CONFIGURAR CORREO (PHPMailer)
            // ====================================
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUser;
            $mail->Password = $smtpPass;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = $smtpPort;
            $mail->CharSet = 'UTF-8';

            // ========== CORREO AL CLIENTE ==========
            $mail->setFrom($smtpUser, 'One Nine Vine');
            $mail->addAddress($email, $name);
            $mail->Subject = "Welcome to One Nine Vine: Your subscription is confirmed!";
            $mail->isHTML(true);

            $mail->Body = "
            <html>
            <body style='font-family: Arial, sans-serif; color:#333;'>
                <h2>Dear {$name},</h2>
                <p>Thank you for your interest in <strong>One Nine Vine - Phase II</strong>!</p>
                <p>We are pleased to confirm that your subscription has been <strong>successfully received</strong>. Your exclusive access to our project updates is now active.</p>
                
                <p><strong>What to Expect:</strong></p>
                <ul>
                    <li>Exclusive previews of the new development</li>
                    <li>Early access to pre-launch information</li>
                    <li>Special opportunities for early adopters</li>
                    <li>Regular updates on project milestones</li>
                </ul>

                <p>Our team will be reaching out soon with exciting details about <strong>Vine Phase II</strong>. In the meantime, if you have any questions, feel free to contact us directly.</p>

                <p>We are thrilled to have you as part of the One Nine Vine community!</p>

                <br><br>
                <p>Best regards,</p>
                
                <!-- Firma corporativa -->
                <table style='font-family:Arial,sans-serif;width:100%;max-width:500px;margin-top:10px;border-top:1px solid #ccc;padding-top:15px;'>
                <tr>
                    <td style='vertical-align:middle;padding-right:15px;width:90px;'>
                    <img src='https://onenine-vine.com/logo.png' alt='One Nine Vine' style='max-width:90px;'>
                    </td>
                    <td style='vertical-align:middle;font-size:14px;color:#333;'>
                    <strong style='font-size:16px;color:#1a1a1a;'>One Nine Vine Team</strong><br>
                    <span>Luxury Residential Development</span><br>
                    <span style='font-size:12px;color:#575757;'>Email: </span><a href='mailto:info@onenine-vine.com' style='color:#4a9d6f;text-decoration:none;'>info@onenine-vine.com</a><br>
                    <span style='font-size:12px;color:#575757;'>Web: </span><a href='https://onenine-vine.com' style='color:#4a9d6f;text-decoration:none;'>www.onenine-vine.com</a>
                    </td>
                </tr>
                </table>

            </body>
            </html>
            ";

            $mail->send();

            // ========== CORREO INTERNO AL EQUIPO ==========
            $mail->clearAddresses();
            $mail->addAddress("info@onenine-vine.com");
            $mail->Subject = "📩 New Newsletter Subscription - {$name}";
            $mail->Body = "
            <html>
            <body style='font-family:Arial,sans-serif;color:#333;'>
              <h3>New Newsletter Subscription</h3>
              <p><strong>Name:</strong> {$name}</p>
              <p><strong>Email:</strong> {$email}</p>
              <p><strong>Phone:</strong> " . ($phone ? $phone : 'Not provided') . "</p>
              <p><strong>Subscription Date:</strong> " . date('Y-m-d H:i:s') . "</p>
              <hr>
              <p><em>One Nine Vine - Vine Phase II Coming Soon</em></p>
            </body>
            </html>";

            $mail->send();

        } catch (Exception $e) {
            $mailError = $e->getMessage();
            error_log("❌ Mail Error: " . $mailError);
        }

        // 3. RESPUESTA FINAL AL USUARIO
        if ($dbError && $mailError) {
            // Ambos fallaron
            echo "<script>
                alert('⚠️ Total failure: Database and Email could not be processed.');
                window.history.back();
            </script>";
        } elseif ($dbError) {
            // Solo falló DB, mail enviado
            echo "<script>
                alert('✅ Email sent, but there was a database issue. Our team is notified.');
                window.location.href='coming/index.html';
            </script>";
        } elseif ($mailError) {
            // Solo falló Mail, DB guardada
            echo "<script>
                alert('✅ Data saved, but there was an email issue. We will contact you soon.');
                window.location.href='coming/index.html';
            </script>";
        } else {
            // Todo éxito
            echo "<script>
                alert('✅ Thank you! Your subscription has been confirmed.');
                window.location.href='coming/index.html';
            </script>";
        }
    } else {
        echo "<script>alert('Please fill in all required fields.'); window.history.back();</script>";
    }
} else {
    echo "<script>alert('Invalid request.'); window.history.back();</script>";
}
?>

