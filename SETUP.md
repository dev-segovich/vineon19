# Configuración de send.php - One Nine Vine

## ⚙️ Pasos de Configuración

### 1. **PHPMailer Installation**
Descargar PHPMailer desde: https://github.com/PHPMailer/PHPMailer

```bash
cd /opt/lampp/htdocs/vineon19/
git clone https://github.com/PHPMailer/PHPMailer.git PHPMailer-master
```

O descargar el ZIP y extraer en la carpeta `PHPMailer-master`.

---

### 2. **Configurar Base de Datos**

En el archivo `send.php`, busca la sección "CONEXIÓN A LA BASE DE DATOS" y completa:

```php
$host = 'localhost';
$dbname = 'vineon19_db';      // TU BASE DE DATOS
$username = 'root';            // TU USUARIO MySQL
$password = '';                // TU CONTRASEÑA MySQL
```

**Crear tabla en tu BD:**

```sql
CREATE TABLE IF NOT EXISTS onv_newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3. **Configurar SMTP (Correos)**

En `send.php`, sección "CREDENCIALES SMTP":

```php
$smtpHost = 'mail.example.com';          // Tu servidor SMTP
$smtpUser = 'no-reply@onenine-vine.com'; // Tu email
$smtpPass = 'tu_contraseña_real';        // Tu contraseña
$smtpPort = 465;  // o 587 si usas STARTTLS
```

**Opciones populares:**

| Proveedor | Host | Puerto | Encriptación |
|-----------|------|--------|--------------|
| Gmail | smtp.gmail.com | 587 | STARTTLS |
| Outlook | smtp-mail.outlook.com | 587 | STARTTLS |
| Zoho | smtp.zoho.com | 465 | SMTPS |
| SendGrid | smtp.sendgrid.net | 587 | STARTTLS |

---

### 4. **Estructura de Archivos**

```
/opt/lampp/htdocs/vineon19/
├── send.php                          ← Procesador de formulario
├── index.html                        ← Página coming soon
├── script.js                         ← JavaScript
├── styles.css                        ← CSS
├── coming/
│   └── ... (archivos anteriores)
└── PHPMailer-master/                 ← Descarga aquí
    └── src/
        ├── PHPMailer.php
        ├── SMTP.php
        └── Exception.php
```

---

### 5. **Verificación**

Después de configurar, abre la página y prueba el formulario:

✅ El correo debe llegar a:
- Al usuario (confirmación)
- A info@onenine-vine.com (notificación interna)

✅ Los datos deben guardarse en la BD

✅ El sistema de anti-bot debe bloquear bots

---

### 6. **Errores Comunes**

| Error | Solución |
|-------|----------|
| "Class 'PHPMailer' not found" | Verifica que PHPMailer esté en `/PHPMailer-master/src/` |
| "SMTP connection refused" | Verifica Host, Puerto y que SMTP esté habilitado |
| "Database connection error" | Verifica credenciales MySQL y que la BD existe |
| "Table doesn't exist" | Crea la tabla SQL que se muestra arriba |

---

### 7. **Logs de Depuración**

Los errores se guardan en `error_log` de tu servidor. Busca en:
- `/opt/lampp/logs/php_error.log`
- O en la carpeta raíz si usas XAMPP

---

**¿Preguntas?** Revisa que todas las credenciales sean correctas. 🚀
