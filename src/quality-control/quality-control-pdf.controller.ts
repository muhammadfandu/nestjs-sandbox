// quality-control-pdf.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import type { Response } from 'express';
import { QualityControlPdfService } from './quality-control-pdf.service';
import { MOCK_ISSUES } from './data';

@Controller('quality-control')
export class QualityControlPdfController {
  constructor(private readonly pdfService: QualityControlPdfService) {}

  @Get('generate-pdf')
  async generatePdf(
    @Res() res: Response,
  ) {
    try {
      const issues = MOCK_ISSUES;

      if (!issues || !Array.isArray(issues) || issues.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Issues array is required and must not be empty',
        });
      }

      const pdf = await this.pdfService.generateQualityControlReport(issues);

      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   'inline; filename=quality-control-report-' + Date.now() + '.pdf'
      // );
      // res.setHeader('Content-Length', pdf.length);

      // return res.send(pdf);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=report.pdf',
        'Content-Length': pdf.length.toString()
      });
      res.send(pdf);
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new InternalServerErrorException('Failed to generate PDF');
    }
  }

  @Post('generate-single-issue-pdf')
  async generateSingleIssuePdf(
    @Body() body: { issue: any },
    @Res() res: Response,
  ) {
    try {
      const { issue } = body;

      if (!issue) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Issue data is required',
        });
      }

      const pdf = await this.pdfService.generateSingleIssueReport(issue);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=issue-${issue.id || Date.now()}.pdf`,
      );
      res.setHeader('Content-Length', pdf.length);

      return res.send(pdf);
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new InternalServerErrorException('Failed to generate PDF');
    }
  }
}
