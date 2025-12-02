// pdf.service.ts
import { Injectable } from '@nestjs/common';
import { BrowserService } from '../browser/browser.service';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class PdfService {
  constructor(private readonly browserService: BrowserService) {}

  async generatePdfFromHtml(html: string): Promise<Buffer> {
    const browser = await this.browserService.getBrowser();
    const page = await browser.newPage(); // Fast, reused browser
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });
    await browser.close();
    return Buffer.from(pdf.buffer);
  }

  async generateInvoicePdf(data: any): Promise<Buffer> {
    // Load template
    const templatePath = path.join(__dirname, '..', 'templates', 'invoice.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    // Render HTML with data
    const html = template({
      invoiceId: data.invoiceId || 'INV-001',
      date: new Date().toLocaleDateString(),
      customer: data.customer || {},
      items: data.items || [
        { description: 'Service A', quantity: 2, price: 100, total: 200 },
        { description: 'Service B', quantity: 1, price: 300, total: 300 },
      ],
      total: data.total || 500,
      logoUrl: 'https://your-company.com/logo.png', // Or base64: 'data:image/png;base64,...'
    });

    // Launch browser (reuse if possible, as we discussed)
    const browser = await this.browserService.getBrowser();
    const page = await browser.newPage(); // Fast, reused browser
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Renders CSS backgrounds/images
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    });

    await browser.close();
    return Buffer.from(pdfBuffer.buffer);
  }
}