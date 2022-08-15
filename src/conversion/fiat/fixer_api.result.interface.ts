export interface ConversionResult {
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