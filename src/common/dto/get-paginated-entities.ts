import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsJSON, IsOptional, Max, Min, Validate } from 'class-validator';
import { PipelineStage } from 'mongoose';

import { SortsParamValidator } from '../validators/sorts/sorts-param.validator';

const PAGINATION_DEFAULT = 50;
const PAGINATION_MAX = 100;

export class GetPaginatedEntities {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  pagination?: boolean;

  @IsOptional()
  @Validate(SortsParamValidator)
  @ApiPropertyOptional()
  @IsJSON()
  sorts?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  @Min(0)
  page?: number;

  @IsInt()
  @Max(PAGINATION_MAX)
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional()
  limit?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static buildCountQuery(_dto: GetPaginatedEntities): PipelineStage.Match {
    return { $match: {} };
  }

  static buildResultsQuery(dto: GetPaginatedEntities) {
    const pipelineStage: PipelineStage[] = [this.buildCountQuery(dto)];

    if (dto.sorts) {
      pipelineStage.push({
        $sort: JSON.parse(dto.sorts) as Record<string, 1 | -1>,
      });
    }

    const isPaginated = dto.pagination ?? true;
    if (isPaginated) {
      const page = Number(dto.page ?? 0);
      const limit = Number(dto.limit ?? PAGINATION_DEFAULT);

      pipelineStage.push({ $skip: page * limit }, { $limit: limit });
    }

    return pipelineStage;
  }
}
