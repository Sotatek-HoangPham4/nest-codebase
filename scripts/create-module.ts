import * as fs from 'fs';
import * as path from 'path';

/**
 * Usage:
 * npx ts-node scripts/create-module.ts <moduleName>
 * Example:
 * npx ts-node scripts/create-module.ts session
 */

const moduleName = process.argv[2];

if (!moduleName) {
  console.error(
    'Please provide a module name: npx ts-node scripts/create-module.ts <moduleName>',
  );
  process.exit(1);
}

// Base directory inside src/modules
const baseDir = path.join(__dirname, '..', 'src', 'modules', moduleName);

/**
 * Templates for files
 */
function dtoTemplate(name: string) {
  return `export class ${name}Dto {
  // TODO: define DTO properties
}`;
}

function responseDtoTemplate(name: string) {
  return `import { ${capitalize(name)} } from '../../domain/entities/${name}.entity';

export class ${capitalize(name)}ResponseDto {
  static toResponse(entity: ${capitalize(name)}) {
    return {
      id: entity.id,
      // TODO: map other properties
    };
  }
}`;
}

function serviceTemplate(name: string) {
  return `import { Injectable, Inject } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${name}.repository.interface';
import { ${capitalize(name)} } from '../../domain/entities/${name}.entity';

@Injectable()
export class ${capitalize(name)}Service {
  constructor(
    @Inject('${capitalize(name)}Repository')
    private readonly repo: ${capitalize(name)}Repository,
  ) {}

  // Example: create method
  async create(dto: any): Promise<${capitalize(name)}> {
    // TODO: implement creation logic
    return null as any;
  }
}`;
}

function useCaseTemplate(name: string, useCase: string) {
  return `import { Injectable } from '@nestjs/common';
import { ${capitalize(name)}Service } from '../services/${name}.service';

@Injectable()
export class ${capitalize(useCase)}${capitalize(name)}UseCase {
  constructor(private readonly service: ${capitalize(name)}Service) {}

  async execute(...args: any[]) {
    // TODO: implement use case logic
  }
}`;
}

function controllerTemplate(name: string) {
  return `import { Controller, Get, Post, Patch, Param, Body, Req } from '@nestjs/common';
import { ${capitalize(name)}Service } from '../../application/services/${name}.service';
import { ${capitalize(name)}ResponseDto } from '../dtos/${name}-response.dto';
import type { Request } from 'express';

@Controller('${name}s')
export class ${capitalize(name)}Controller {
  constructor(private readonly service: ${capitalize(name)}Service) {}

  @Post()
  async create(@Body() dto: any) {
    const entity = await this.service.create(dto);
    return {
      message: '${capitalize(name)} created successfully',
      data: ${capitalize(name)}ResponseDto.toResponse(entity),
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const entity = await this.service.getById(id);
    return {
      message: 'Get ${name} successfully',
      data: ${capitalize(name)}ResponseDto.toResponse(entity),
    };
  }

  @Patch(':id/revoke')
  async revoke(@Param('id') id: string) {
    await this.service.revoke(id);
    return { message: '${capitalize(name)} revoked successfully' };
  }
}`;
}

function moduleTemplate(name: string) {
  return `import { Module } from '@nestjs/common';
import { ${capitalize(name)}Service } from './application/services/${name}.service';
import { ${capitalize(name)}Controller } from './presentation/controllers/${name}.controller';

@Module({
  controllers: [${capitalize(name)}Controller],
  providers: [${capitalize(name)}Service],
})
export class ${capitalize(name)}Module {}`;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Structure of the module
 */
const structure = {
  domain: {
    entities: [`${moduleName}.entity.ts`],
    repositories: [`${moduleName}.repository.interface.ts`],
    services: [],
    'value-objects': ['index.vo.ts'],
  },
  application: {
    dtos: [
      `create-${moduleName}.dto.ts`,
      `get-${moduleName}.dto.ts`,
      `update-${moduleName}.dto.ts`,
      `delete-${moduleName}.dto.ts`,
    ],
    'use-cases': [
      `create-${moduleName}.use-case.ts`,
      `get-${moduleName}.use-case.ts`,
      `update-${moduleName}.use-case.ts`,
      `delete-${moduleName}.use-case.ts`,
    ],
  },
  infrastructure: {
    persistence: {
      mappers: [`${moduleName}.mapper.ts`],
      orm: [`${moduleName}.orm-entity.ts`],
      repositories: [`${moduleName}.repository.ts`],
    },
    services: [`${moduleName}.service.ts`],
  },

  presentation: {
    controllers: [`${moduleName}.controller.ts`],
    dtos: [`${moduleName}-response.dto.ts`],
  },
  [`${moduleName}.module.ts`]: null,
};

/**
 * Recursively create structure and populate templates
 */
function createStructure(dir: string, struct: any) {
  fs.mkdirSync(dir, { recursive: true });

  Object.entries(struct).forEach(([key, value]) => {
    const fullPath = path.join(dir, key);

    if (value === null) {
      fs.writeFileSync(fullPath, moduleTemplate(moduleName), { flag: 'w' });
    } else if (Array.isArray(value)) {
      fs.mkdirSync(fullPath, { recursive: true });
      value.forEach((file) => {
        const filePath = path.join(fullPath, file);

        // Determine which template to use
        let content = `// ${file}`; // default

        if (file.endsWith('.dto.ts')) content = dtoTemplate(moduleName);
        else if (file.endsWith('-response.dto.ts'))
          content = responseDtoTemplate(moduleName);
        else if (file.endsWith('.service.ts'))
          content = serviceTemplate(moduleName);
        else if (file.endsWith('.controller.ts'))
          content = controllerTemplate(moduleName);
        else if (file.endsWith('.use-case.ts'))
          content = useCaseTemplate(moduleName, file.split('-')[0]);

        fs.writeFileSync(filePath, content, { flag: 'w' });
      });
    } else {
      createStructure(fullPath, value);
    }
  });
}

// Generate module
createStructure(baseDir, structure);

console.log(
  `Advanced DDD module '${moduleName}' with boilerplate generated successfully at modules/${moduleName}`,
);
