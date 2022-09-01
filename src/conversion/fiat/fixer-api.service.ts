import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestHeaders } from "axios";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";

@Injectable()
export class FixerApiService {
  private log: Logger = new Logger(this.constructor.name);
  private header: AxiosRequestHeaders;
  private baseUrl = new URL("https://api.apilayer.com/fixer");
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.header = {
      apikey: this.configService.get("APILAYER_API"),
    };
  }
  /*
    Returning all available currencies.
    */
  public getSymbols = async () => {
    const url = new URL(this.baseUrl.href);
    url.pathname = "fixer/symbols";
    const response = await firstValueFrom(
      this.httpService.get<Symbols>(url.href, { headers: this.header }),
    );
    return response.data;
  };

  /**
   * Get the latest exchange rates.
   * @param base - base currency
   * @param symbols - list of currencies to know the exchange rate
   * @returns exchange rate for the base currency and the list of currencies
   */
  public getLatest = async (base: string, symbols: string[]) => {
    const url = new URL(this.baseUrl.href);
    url.pathname = "fixer/latest";
    url.searchParams.append("base", base);
    url.searchParams.append("symbols", symbols.join(","));
    const response = await firstValueFrom(
      this.httpService.get<Rates>(url.href, { headers: this.header }),
    );
    return response.data;
  };

  /**
   * Get the conversion result for the given amount and base/quote currencies.
   * @param amount - amount to convert
   * @param from - currency to convert from
   * @param to - currency to convert to
   * @param date - date of the exchange rate - if not provided, the latest exchange rate is used
   * @returns  conversion result in the to currency
   */
  public getConvert = async (
    amount: number,
    from: string,
    to: string,
    date?: Date,
  ): Promise<Conversion> => {
    const url = new URL(this.baseUrl.href);
    url.pathname = "fixer/convert";
    url.searchParams.append("from", from);
    url.searchParams.append("to", to);
    url.searchParams.append("amount", amount.toString());
    if (date) {
      url.searchParams.append("date", date.toISOString());
    }
    this.log.log(`url: ${url.toString()}`);
    const response = await firstValueFrom(
      this.httpService.get<Conversion>(url.toString(), { headers: this.header }),
    );
    return response.status === 200 ? response.data : null;
  };

  /**
   * Get the fluctuation for given base with other symbols on the dates.
   * @param startDate - start date of the historical exchange rate
   * @param endDate - end date of the historical exchange rate
   * @param base  - base currency
   * @param symbols - list of currencies to know the exchange rate
   * @returns fluctuation of the exchange rate for the base currency and the list of currencies
   */
  public getFlucuations = async (
    startDate: Date,
    endDate: Date,
    base: string,
    symbols: string[],
  ) => {
    const url = new URL(this.baseUrl.href);
    url.pathname = "fixer/flucuation";
    url.searchParams.append("start_date", startDate.toISOString());
    url.searchParams.append("end_date", endDate.toISOString());
    url.searchParams.append("base", base);
    url.searchParams.append("symbols", symbols.join(","));
    const response = await firstValueFrom(
      this.httpService.get<Flucuations>(url.href, { headers: this.header }),
    );
    return response.data.rates;
  };

  /**
   * Timeseries endpoint lets you query the API for daily historical rates between two dates of your choice, with a maximum time frame of 365 days.
   */
  public getTimeSeries = async (
    startDate: Date,
    endDate: Date,
    base?: string,
    symbols?: string[],
  ) => {
    if (
      (endDate.getTime() - startDate.getTime()) > (365 * 24 * 60 * 60 * 1000)
    ) {
      throw new Error(
        "Time series can only be queried for a maximum of 365 days",
      );
    }

    const url = new URL(this.baseUrl.href);
    url.pathname = "fixer/timeseries";
    url.searchParams.append("start_date", startDate.toISOString());
    url.searchParams.append("end_date", endDate.toISOString());
    if (base) {
      url.searchParams.append("base", base);
    }
    if (symbols) {
      url.searchParams.append("symbols", symbols.join(","));
    }

    const response = await firstValueFrom(
      this.httpService.get<Rates>(url.toString(), {
        headers: this.header,
      }),
    );
    return response.data.rates;
  };

  /**
   * Historical rates are available for most currencies all the way back to the year of 1999. You can query the Fixer API for historical rates by appending a date (format YYYY-MM-DD) to the base URL.
   * @param date A date in the past for which historical rates are required.
   * @param base Enter the three-letter currency code for the base currency.
   * @param symbols Enter a list of currency codes for the symbols of the currencies you want to retrieve rates for.
   */
  public getDate = async (
    date: Date,
    base?: string,
    symbols?: string[],
  ) => {
    const url = new URL(this.baseUrl.href);
    url.pathname = `fixer/${date}`;
    if (base) {
      url.searchParams.append("base", base);
    }
    if (symbols) {
      url.searchParams.append("symbols", symbols.join(","));
    }
    const response = await firstValueFrom(
      this.httpService.get<HistoricalRates>(url.toString(), {
        headers: this.header,
      }),
    );
    return response.data;
  };
}

export interface Symbols {
  success: boolean;
  symbols: {
    [symbol: string]: string;
  };
}

export interface HistoricalRates extends Rates {}

export interface Rates {
  success: boolean;
  base: string;
  date: Date;
  historical: boolean;
  rates: {
    [symbol: string]: number;
  };
  timestamp: number;
}

export interface HistoricalRatesTimeSeries {
  base: string;
  end_date: Date;
  start_date: Date;
  success: boolean;
  timestamp: number;
  rates: {
    [date: string]: {
      [quoted: string]: number;
    };
  };
}

export interface Conversion {
  date: string;
  historical: boolean;
  info: {
    rate: number;
    timestamp: number;
  };
  query: {
    amount: number;
    from: string;
    to: string;
  };
  result: number;
  success: boolean;
}

export interface Flucuations {
  success: boolean;
  timestamp: number;
  end_date: Date;
  start_date: Date;
  fluctuation: true;
  rates: {
    [symbol: string]: {
      change: number;
      change_pct: number;
      end_rate: number;
      start_rate: number;
    };
  };
}
