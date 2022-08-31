import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { Repository } from "typeorm/repository/Repository";
import { FiatConversion } from "./conversion.entity";
import { Fiat } from "./fiat.entity";
import {
  Conversion as FixerApiConversion,
  FixerApiService,
} from "./fixer-api.service";

@Injectable()
export class FiatService {
  log: Logger = new Logger(this.constructor.name);

  constructor(
    private fixerApi: FixerApiService,
    @InjectRepository(FiatConversion) private readonly repo: Repository<FiatConversion>,
    @InjectRepository(Fiat) private readonly fiatRepo: Repository<Fiat>
  ) {}

  public async convert(
    amount: number,
    from: string,
    to: string,
    historicalDate?: Date,
  ): Promise<number> {
    from = from.toLowerCase();
    to = to.toLowerCase();

    if (historicalDate) {
      const historyResult =
        (await this.fixerApi.getDate(historicalDate, from, [to]));
      return historyResult.rates[to.toUpperCase()];
    }

    const findCondition: FindOneOptions<FiatConversion> = {
      where: {
        from: from,
        to: to,
      },
    };
    const cachedConversion = await this.repo.findOne(findCondition);

    this.log.debug(`cachedConversion: ${JSON.stringify(cachedConversion)}`);

    if (cachedConversion) {
      if (await this.is_data_fresh(cachedConversion)) {
        return cachedConversion.rate;
      }
      await this.remove_cache(cachedConversion);
    }

    const curretnRate = await this.fetch_latest_conversion_rate(
      amount,
      from,
      to,
    );
    return curretnRate;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  public async populate_all_fiat(){
    let symbols = await this.fixerApi.getSymbols()
    if(symbols.success){
      for (const symbol in symbols.symbols) {
        const name = symbols.symbols[symbol]
        await this.fiatRepo.save({name , symbol})
      }
    }
    return symbols;
  }

  async is_data_fresh(conversion: FiatConversion) {
    if (!conversion) {
      return false;
    }

    const ONE_WEEK_IN_MILLISECOND = 604800000;
    const now = new Date(Date.now());
    const entryDate = conversion.entry_date;
    const diff = now.getTime() - entryDate.getTime();

    return diff <= ONE_WEEK_IN_MILLISECOND;
  }

  async fetch_latest_conversion_rate(amount: number, from: string, to: string) {
    const conversion = await this.fixerApi.getConvert(amount, from, to);
    await this.cache_conversion_rate(conversion);
    return conversion.result;
  }

  async cache_conversion_rate(result: FixerApiConversion) {
    // Cache the conversion rate
    const data: FiatConversion = {
      from: result.query.from.toLowerCase(),
      to: result.query.to.toLowerCase(),
      rate: result.result,
      entry_date: new Date(Date.now()),
    };
    this.log.log(
      `Caching conversion rate: ${JSON.stringify(data)}`,
      this.constructor.name,
    );

    const findCondition: FindOneOptions<FiatConversion> = {
      where: {
        from: data.from,
        to: data.to,
      },
    };

    const cachedConversion = await this.repo.findOne(findCondition);

    if (!cachedConversion) {
      this.log.debug("Caching new conversion rate");
      await this.repo.save(data).catch((err) => {
        this.log.error(`Caching failed: ${err}`);
      });
    }
  }

  async remove_cache(conversion: FiatConversion) {
    await this.repo.remove(conversion).catch((err) => {
      this.log.error(`Removing cache failed: ${err}`);
    });
  }

  async fetch_historical_conversion_rate(
    amount: number,
    from: string,
    to: string,
    date: Date,
  ) {
    const historicalConversion = await this.fixerApi.getDate(date, from, [to]);
    if (!historicalConversion.success) {
      throw new Error("Conversion failed");
    }
    return historicalConversion.rates;
  }
}
