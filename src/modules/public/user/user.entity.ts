import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/app_base.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity({ schema: `public` })
export class User extends BaseEntity {

  @Column({ unique: true })
 
  wallet: string;

  @Column()
  @ApiProperty({
    description: `wallet network type`,
    type: String,
    default: `ether`,
    enum: [
      `ether`,
      `substrate`,
      `solana`,
      `cardano`,
      `near`,
      `tezos`,
      `bitcoin`,
    ],
  })
  type: string;
}
