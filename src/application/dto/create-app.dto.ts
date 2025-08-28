import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAppDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString({ each: true })
  @IsOptional()
  config?: string[];
}
