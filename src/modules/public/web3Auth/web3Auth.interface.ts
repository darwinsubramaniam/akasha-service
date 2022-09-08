export interface IWeb3Auth {
    wallet: {
        address: string;
        type: string;
    };
    data :{
        signed: string;
        raw: string;
    }
}