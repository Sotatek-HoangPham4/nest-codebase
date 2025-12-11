import { RoleIdVO, RoleNameVO } from '../value-objects/role.vo';

export type RoleProps = {
  id: RoleIdVO;
  name: RoleNameVO;
  description?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class RoleEntity {
  private domainEvents: any[] = [];
  private constructor(private props: RoleProps) {}

  static create(props: {
    id: string;
    name: string;
    description?: string | null;
    createdAt?: Date;
  }) {
    const now = props.createdAt ?? new Date();
    const entity = new RoleEntity({
      id: RoleIdVO.create(props.id),
      name: RoleNameVO.create(props.name),
      description: props.description ?? null,
      createdAt: now,
      updatedAt: null,
    });
    entity.recordEvent({
      name: 'RoleCreated',
      occurredAt: new Date(),
      payload: { id: entity.id, name: entity.name },
    });
    return entity;
  }

  static restore(primitives: {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
  }) {
    return new RoleEntity({
      id: RoleIdVO.create(primitives.id),
      name: RoleNameVO.create(primitives.name),
      description: primitives.description ?? null,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt ?? null,
    });
  }

  get id() {
    return this.props.id.toString();
  }
  get name() {
    return this.props.name.toString();
  }
  get description() {
    return this.props.description ?? null;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt ?? null;
  }

  rename(newName: string) {
    this.props.name = RoleNameVO.create(newName);
    this.props.updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
    };
  }

  recordEvent(e: any) {
    this.domainEvents.push(e);
  }
  pullEvents() {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}
