import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateOrganizationUseCase } from '../../application/use-cases/create-organization.use-case';
import { GetOrganizationUseCase } from '../../application/use-cases/get-organization.use-case';
import { UpdateOrganizationUseCase } from '../../application/use-cases/update-organization.use-case';
import { DeleteOrganizationUseCase } from '../../application/use-cases/delete-organization.use-case';
import { GetMyOrganizationsUseCase } from '../../application/use-cases/get-my-organizations.use-case';
import { GetCurrentOrganizationUseCase } from '../../application/use-cases/get-current-organization.use-case';
import { GetOrganizationMembersUseCase } from '../../application/use-cases/get-organization-members.use-case';
import { AddOrganizationMemberUseCase } from '../../application/use-cases/add-organization-member.use-case';
import { RemoveOrganizationMemberUseCase } from '../../application/use-cases/remove-organization-member.use-case';
import { ChangeMemberRoleUseCase } from '../../application/use-cases/change-member-role.use-case';
import { GetOrganizationSettingsUseCase } from '../../application/use-cases/get-organization-settings.use-case';
import { UpdateOrganizationSettingsUseCase } from '../../application/use-cases/update-organization-settings.use-case';
import { OrgRole } from '../../domain/value-objects/org-role.vo';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { CurrentOrg } from '@/shared/decorators/current-org.decorator';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CreateOrganizationDto } from '../../application/dtos/create-organization.dto';

@UseGuards(AuthGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createUC: CreateOrganizationUseCase,
    private readonly getUC: GetOrganizationUseCase,
    private readonly updateUC: UpdateOrganizationUseCase,
    private readonly deleteUC: DeleteOrganizationUseCase,
    private readonly myUC: GetMyOrganizationsUseCase,
    private readonly currentUC: GetCurrentOrganizationUseCase,
    private readonly memberUC: GetOrganizationMembersUseCase,
    private readonly addMemberUC: AddOrganizationMemberUseCase,
    private readonly removeMemberUC: RemoveOrganizationMemberUseCase,
    private readonly changeRoleUC: ChangeMemberRoleUseCase,
    private readonly getSettingsUC: GetOrganizationSettingsUseCase,
    private readonly updateSettingsUC: UpdateOrganizationSettingsUseCase,
    private readonly getMyUC: GetMyOrganizationsUseCase,
  ) {}

  @Post()
  create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.createUC.execute(dto, user.id);
  }

  @Get('me')
  my(@CurrentUser() user) {
    return this.myUC.execute(user.id);
  }

  @Get('current')
  current(@CurrentOrg() orgId: string) {
    return this.currentUC.execute(orgId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getUC.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto) {
    return this.updateUC.execute(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deleteUC.execute(id);
  }

  // members
  @Get(':id/members')
  members(@Param('id') id: string) {
    return this.memberUC.execute(id);
  }

  @Post(':id/members')
  async addMember(@Param('id') id: string, @Body() dto) {
    const members = await this.addMemberUC.execute(id, dto);
    return {
      message: 'Add member with role into organization successfully',
      data: members,
    };
  }

  @Delete(':id/members/:userId')
  remove(@Param('id') id: string, @Param('userId') userId: string) {
    return this.removeMemberUC.execute(id, userId);
  }

  @Put(':id/members/:userId/role')
  changeRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body('role') roleId: string,
  ) {
    return this.changeRoleUC.execute(id, userId, roleId);
  }

  // settings
  @Get(':id/settings')
  getSettings(@Param('id') id: string) {
    return this.getSettingsUC.execute(id);
  }

  @Put(':id/settings')
  updateSettings(@Param('id') id: string, @Body() body) {
    return this.updateSettingsUC.execute(id, body);
  }
}
