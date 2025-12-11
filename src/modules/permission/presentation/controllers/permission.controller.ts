// permission/interfaces/controllers/permission.controller.ts
// Controller coordinates HTTP <-> application use-cases.
// Keep controller thin: validate, map to input model, call use-case, return response.
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePermissionUseCase } from '../../application/use-cases/create-permission.use-case';

import {
  CreatePermissionRequestDto,
  GetPermissionsQueryDto,
} from '../dtos/permission.request.dto';
import {
  PermissionResponseDto,
  PermissionListResponseDto,
} from '../dtos/permission.response.dto';
import { Permission } from '../../domain/entities/permission.entity';
import { GetPermissionsUseCase } from '../../application/use-cases/get-permission.use-case';
import { GetPermissionDetailsUseCase } from '../../application/use-cases/get-permission-details.use-case';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreatePermissionRequestDto): Promise<any> {
    const created = await this.createPermissionUseCase.execute({
      code: body.code,
      description: body.description,
      group: body.group,
    });

    const res = await this.toResponse(created);

    return {
      message: 'Permission created successfully',
      data: res,
    };
  }

  @Get()
  async list(
    @Query() query: GetPermissionsQueryDto,
  ): Promise<PermissionListResponseDto> {
    const { items, total } = await this.getPermissionsUseCase.execute({
      group: query.group,
      q: query.q,
      skip: Number(query.skip) || 0,
      take: Number(query.take) || 50,
    });

    return {
      items: items.map((i) => this.toResponse(i)),
      total,
    };
  }

  private toResponse(permission: Permission): PermissionResponseDto {
    return {
      id: permission.id,
      code: permission.code.toString(),
      description: permission.description,
      group: permission.group,
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
    };
  }
}
