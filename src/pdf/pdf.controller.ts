import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';
import { pdfTemplate } from '../templates/template';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('report')
  async generateReport(@Res() res: Response) {
    const html = pdfTemplate;
    const pdfBuffer = await this.pdfService.generatePdfFromHtml(html);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=report.pdf',
    });
    res.send(pdfBuffer);
  }

  @Get('invoice')
  async generateInvoice(@Res() res: Response) {
    const data = {
      invoiceId: 'INV-001',
      date: new Date().toISOString(),
      customer: { name: 'John Doe', email: 'john@example.com' },
      items: [
        { description: 'Service A', quantity: 2, price: 100, total: 400 },
        { description: 'Service B', quantity: 1, price: 300, total: 300 },
      ],
      total: 700,
      logoUrl: 'https://your-company.com/logo.png',
    };
    const pdfBuffer = await this.pdfService.generateInvoicePdf(data);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=invoice.pdf',
    });
    res.send(pdfBuffer);
  }
}