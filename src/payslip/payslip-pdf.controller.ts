// payslip-pdf.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  InternalServerErrorException,
  Get
} from '@nestjs/common';
import type { Response } from 'express';
import type { PayslipData } from './payslip-pdf.service';
import { PayslipPdfService } from './payslip-pdf.service';
import { MOCK_PAYSLIP } from './data';

@Controller('payslip')
export class PayslipPdfController {
  constructor(private readonly payslipPdfService: PayslipPdfService) {}

  /**
   * Generate PDF for a single payslip
   * POST /payslip/generate-pdf
   */
  @Get('generate-pdf')
  async generatePayslipPdf(
    // @Body() payslipData: PayslipData,
    @Res() res: Response,
  ) {
    try {
      const payslipData = MOCK_PAYSLIP;

      if (!payslipData || !payslipData.user || !payslipData.payroll) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid payslip data. User and payroll information are required.',
        });
      }

      const pdf = await this.payslipPdfService.generatePayslipPdf(payslipData);

      // Generate filename based on user name and date
      const userName = payslipData.user.name.replace(/\s+/g, '_');
      const date = new Date(payslipData.payroll.startDate * 1000);
      const monthYear = `${date.toLocaleString('en-US', { month: 'long' })}_${date.getFullYear()}`;
      const filename = `Payslip_${userName}_${monthYear}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${filename}`);
      res.setHeader('Content-Length', pdf.length);

      return res.send(pdf);
    } catch (error) {
      console.error('Payslip PDF generation failed:', error);
      throw new InternalServerErrorException('Failed to generate payslip PDF');
    }
  }

  /**
   * Generate PDFs for multiple payslips (bulk generation)
   * POST /payslip/generate-bulk-pdf
   * Returns a ZIP file containing all payslips
   */
  @Post('generate-bulk-pdf')
  async generateBulkPayslips(
    @Body() body: { payslips: PayslipData[] },
    @Res() res: Response,
  ) {
    try {
      const { payslips } = body;

      if (!payslips || !Array.isArray(payslips) || payslips.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Payslips array is required and must not be empty',
        });
      }

      const pdfs = await this.payslipPdfService.generateBulkPayslips(payslips);

      if (pdfs.length === 0) {
        throw new InternalServerErrorException('Failed to generate any payslips');
      }

      // For simplicity, if only one payslip, return it directly
      if (pdfs.length === 1) {
        const userName = payslips[0].user.name.replace(/\s+/g, '_');
        const date = new Date(payslips[0].payroll.startDate * 1000);
        const monthYear = `${date.toLocaleString('en-US', { month: 'long' })}_${date.getFullYear()}`;
        const filename = `Payslip_${userName}_${monthYear}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Length', pdfs[0].length);

        return res.send(pdfs[0]);
      }

      // If multiple payslips, you would typically create a ZIP file here
      // For now, returning JSON with success message
      // You can implement ZIP generation using a library like 'archiver'
      return res.status(HttpStatus.OK).json({
        message: `Successfully generated ${pdfs.length} payslips`,
        count: pdfs.length,
        note: 'ZIP file generation can be implemented using the archiver library',
      });
    } catch (error) {
      console.error('Bulk payslip generation failed:', error);
      throw new InternalServerErrorException('Failed to generate payslips');
    }
  }

  /**
   * Preview payslip HTML (for testing)
   * POST /payslip/preview-html
   */
  @Post('preview-html')
  async previewPayslipHtml(
    @Body() payslipData: PayslipData,
    @Res() res: Response,
  ) {
    try {
      if (!payslipData || !payslipData.user || !payslipData.payroll) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid payslip data. User and payroll information are required.',
        });
      }

      // This would require exposing the template rendering
      // For now, just generate the PDF
      const pdf = await this.payslipPdfService.generatePayslipPdf(payslipData);

      return res.status(HttpStatus.OK).json({
        message: 'PDF generated successfully',
        size: pdf.length,
      });
    } catch (error) {
      console.error('Preview generation failed:', error);
      throw new InternalServerErrorException('Failed to preview payslip');
    }
  }
}
