import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @Min(0)
  @Type(() => Number)
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price!: number;
}
