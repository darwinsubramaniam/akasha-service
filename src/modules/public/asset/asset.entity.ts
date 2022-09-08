import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../app_base.entity';

@Entity()
export class Asset extends BaseEntity{

    @ApiProperty({description: `ID of the asset in the search platform, used in many of its api calls`})
    @Column()
    platform_id: string;

    @ApiProperty({description: `Name of the platform where asset information was collected from` , example: `CoinGecko or CoinMarketCap`})
    @Column()
    platform_name: string;

    @ApiProperty()
    @Column({unique:true})
    name:string;

    @ApiProperty()
    @Column()
    symbol:string;

    @ApiProperty()
    @Column({nullable:true})
    decimals?:number;

    @ApiProperty()
    @Column({nullable:true})
    image_small?:string;
    @ApiProperty()
    @Column({nullable:true})
    image_thumb?:string;
    @ApiProperty()
    @Column({nullable:true})
    image_large?:string;
}