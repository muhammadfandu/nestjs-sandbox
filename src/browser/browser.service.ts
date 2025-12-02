// browser.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class BrowserService implements OnModuleDestroy {
  private browser: puppeteer.Browser | null = null;
  private browserPromise: Promise<puppeteer.Browser>;

  async getBrowser() {
     if (!this.browserPromise) {
      this.browserPromise = puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });
    }

    this.browser = await this.browserPromise;
    
    // Check if browser is still connected
    if (!this.browser.isConnected()) {
      this.browserPromise = null;
      return this.getBrowser(); // Recreate
    }

    return this.browser;
  }

  async onModuleDestroy() {
    if (this.browser) await this.browser.close();
  }
}