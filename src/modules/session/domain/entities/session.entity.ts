export interface SessionProps {
  id?: string;
  userId: string;
  device: string;
  ipAddress: string;
  userAgent: string;
  refreshTokenHash: string;
  isRevoked: boolean;
  lastUsedAt: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Session {
  private props: SessionProps;

  constructor(props: SessionProps) {
    this.props = props;
  }

  static create(
    props: Omit<SessionProps, 'createdAt' | 'updatedAt' | 'isRevoked' | 'id'>,
  ): Session {
    return new Session({
      id: undefined,
      ...props,
      isRevoked: false,
      lastUsedAt: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get device() {
    return this.props.device;
  }

  get ipAddress() {
    return this.props.ipAddress;
  }

  get userAgent() {
    return this.props.userAgent;
  }

  get refreshTokenHash() {
    return this.props.refreshTokenHash;
  }

  get isRevoked() {
    return this.props.isRevoked;
  }

  get lastUsedAt() {
    return this.props.lastUsedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  revoke() {
    this.props.isRevoked = true;
  }

  touchLastUsedAt() {
    this.props.lastUsedAt = Date.now();
    this.props.updatedAt = new Date();
  }

  rotateRefreshToken(newHash: string) {
    this.props.refreshTokenHash = newHash;
    this.props.updatedAt = new Date();
  }

  getProps() {
    return this.props;
  }
}
