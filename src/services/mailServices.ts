import * as nodemailer from 'nodemailer';
import config from '../config';

class MailService {
  transporter : any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.SMTP_HOST,
      secure: true,
      port: 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(to : string, obj : any) {
    let orderHtml = '<ui>';
    for (let i = 0; i < obj.order.length; i++) {
      orderHtml += `<li>${obj.order[i].name} ${obj.order[i].count}шт.</li>`;
    }
    orderHtml += '</ui>';
    await this.transporter.sendMail({
      from: config.SMTP_USER,
      to,
      subject: 'Заказ в пиццерии “Горячий кусочек”',
      text: '',
      html:
                `
                    <div>
                        <h1>Ваш заказ:</h1>
                        ${orderHtml}
                        Сумма: ${obj.summ}
                        Скидка: ${obj.discount}
                        Итого к оплате: ${obj.summ - obj.discount}
                    </div>
                `,
    });
  }
}

export default MailService;
