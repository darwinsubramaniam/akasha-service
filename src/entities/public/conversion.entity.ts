import { Type } from 'class-transformer';
import { Allow, IsDate, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({schema:'public'})
@Unique([`to` , `from`])
export class FiatConversion {
  @PrimaryGeneratedColumn()
  @Allow()
  id?: number;

  @Column()
  @IsString()
  to: string;

  @Column()
  @IsString()
  from: string;

  @Column()
  @IsNumber()
  rate: number;

  @Column()
  @Type(() => Date)
  @IsDate()
  entry_date: Date;
}
