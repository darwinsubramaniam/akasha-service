import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestHeaders } from "axios";
import { firstValueFrom } from "rxjs";
import { Repository } from "typeorm";
import { Conversion } from "../conversion.entity";
import { ConversionResult } from "./fixer_api.result.interface";

@Injectable()
export class FiatConversionService {
  header: AxiosRequestHeaders;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private repo: Repository<Conversion>,
  ) {
    this.header = {
      "apikey": this.configService.get("APILAYER_API"),
    };
  }

  public async convert(
    amount: number,
    from: string,
    to: string,
    historical_date?: Date,
  ) {
    if (historical_date) {
      return await this.fetch_historical_conversion_rate(
        amount,
        from,
        to,
        historical_date,
      );
    }

    let cached_conversion = await this.repo.findOne({
      where: {
        from: from,
        to: to,
      },
    });

    if (cached_conversion) {
      if (await this.is_data_fresh(cached_conversion)) {
        return cached_conversion.rate;
      }
      await this.remove_cache(cached_conversion);
    }

    let current_rate = await this.fetch_latest_conversion_rate(
      amount,
      from,
      to,
    );
    return current_rate;
  }

  async is_data_fresh(conversion: Conversion) {
    if (!conversion) {
      return false;
    }

    const ONE_WEEK_IN_MILLISECOND = 604800000;
    let now = new Date(Date.now());
    let entry_date = conversion.entry_date;
    let diff = now.getTime() - entry_date.getTime();

    return diff <= ONE_WEEK_IN_MILLISECOND ? true : false;
  }

  async fetch_latest_conversion_rate(amount: number, from: string, to: string) {
    const url =
      `https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}`;

    Logger.debug(
      "Fetching latest conversion rate from: " + url,
      this.constructor.name,
    );

    let response = await firstValueFrom(
      this.httpService.get<ConversionResult>(url, { headers: this.header }),
    );
    let result = response.data;

    if (!result.success) {
      throw new Error("Conversion failed");
    }

    await this.cache_conversion_rate(result);
    return result.result;
  }

  async cache_conversion_rate(result: ConversionResult) {
    // Cache the conversion rate
    let data: Conversion = {
      from: result.query.from,
      to: result.query.to,
      rate: result.result,
      entry_date: new Date(Date.now()),
    };
    await this.repo.save(data);
  }

  async remove_cache(conversion: Conversion) {
    await this.repo.remove(conversion);
  }

  async fetch_historical_conversion_rate(
    amount: number,
    from: string,
    to: string,
    date: Date,
  ) {
    const url =
      `https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}&date=${date}`;
    Logger.debug(
      "Fetching historical conversion rate from: " + url,
      this.constructor.name,
    );
    let response = await firstValueFrom(
      this.httpService.get<ConversionResult>(url, { headers: this.header }),
    );
    let result = response.data;
    if (!result.success) {
      throw new Error("Conversion failed");
    }
    return result.result;
  }
}
