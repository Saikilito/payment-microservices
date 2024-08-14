import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsPositive,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

export class StripeSessionDTO {
  @IsString()
  orderId: string;

  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StripeItemDTO)
  items: StripeItemDTO[];
}

export class StripeItemDTO {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
