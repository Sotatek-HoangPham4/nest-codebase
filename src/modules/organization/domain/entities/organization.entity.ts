export interface OrganizationProps {
  id?: string;
  name: string;
  code: string; // mã tổ chức duy nhất
  description?: string | null;
  ownerId: string; // user tạo tổ chức
  is_active: boolean;
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class Organization {
  private props: OrganizationProps;

  constructor(props: OrganizationProps) {
    this.props = props;
  }

  static create(props: {
    name: string;
    code: string;
    ownerId: string;
    description?: string;
  }): Organization {
    return new Organization({
      id: undefined,
      name: props.name,
      code: props.code,
      description: props.description ?? null,
      ownerId: props.ownerId,
      is_active: true,
      settings: {},
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  update(dto: {
    name?: string;
    description?: string;
    is_active?: boolean;
    settings?: Record<string, any>;
  }) {
    if (dto.name !== undefined) {
      this.props.name = dto.name;
    }

    if (dto.description !== undefined) {
      this.props.description = dto.description;
    }

    if (dto.is_active !== undefined) {
      this.props.is_active = dto.is_active;
    }

    if (dto.settings !== undefined) {
      this.props.settings = dto.settings;
    }

    this.props.updated_at = new Date();
  }

  deactivate() {
    return this.update({ is_active: false });
  }

  get settings() {
    return this.props.settings;
  }

  updateSettings(settings: Record<string, any>) {
    this.props.settings = {
      ...this.props.settings,
      ...settings,
    };
    this.props.updated_at = new Date();
  }

  getProps() {
    return this.props;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get id() {
    return this.props.id;
  }
}
