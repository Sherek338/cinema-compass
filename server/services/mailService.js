import nodemailer from 'nodemailer';

const sendActivationLink = async (to, link) => {
  const letterHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">🎉 Добро пожаловать!</h1>
        <p style="font-size: 16px; color: #555; text-align: center;">
          Спасибо за регистрацию на <strong>${process.env.API_URL}</strong>! <br/>
          Остался всего один шаг — подтвердите свой адрес электронной почты.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${link}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 6px;">
            Активировать аккаунт
          </a>
        </div>
        <p style="font-size: 14px; color: #888; text-align: center;">
          Если кнопка не работает, скопируйте ссылку ниже и вставьте её в адресную строку браузера:
        </p>
        <p style="font-size: 14px; color: #555; word-break: break-all; text-align: center;">
          <a href="${link}" style="color: #4CAF50;">${link}</a>
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.
        </p>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `✨ Добро пожаловать на ${process.env.API_URL}! Подтвердите свою почту`,
      html: letterHtml,
    });
  } catch (e) {
    console.error('Error sending activation email:', e);
  }
};

export default { sendActivationLink };