export interface IAsset{
  id:string;
  name: string
  symbol: string
  decimals?: number
  image? : {
    small? : string
    thumb?: string
    large?: string
  }
}
