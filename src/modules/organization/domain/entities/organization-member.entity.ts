export interface OrganizationMemberProps {
  id?: string;
  organizationId: string;
  userId: string;
  roleId: string; // role trong organization
  joinedAt: Date;
}

export class OrganizationMember {
  constructor(private props: OrganizationMemberProps) {}

  static create(props: {
    organizationId: string;
    userId: string;
    roleId: string;
  }) {
    return new OrganizationMember({
      id: undefined,
      organizationId: props.organizationId,
      userId: props.userId,
      roleId: props.roleId,
      joinedAt: new Date(),
    });
  }

  getProps() {
    return this.props;
  }

  get id() {
    return this.props.id;
  }

  get organizationId() {
    return this.props.organizationId;
  }

  get userId() {
    return this.props.userId;
  }

  get roleId() {
    return this.props.roleId;
  }

  get joinedAt() {
    return this.props.joinedAt;
  }

  toPrimitives() {
    return {
      id: this.props.id,
      organizationId: this.props.organizationId,
      userId: this.props.userId,
      roleId: this.props.roleId,
      joinedAt: this.props.joinedAt.toISOString(),
    };
  }
}
