import { Email } from '../value-objects/email.vo';

export interface UserProps {
  id?: string;
  username: string;
  fullname: string;
  email: Email;
  password: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  provider: string;
  role: string;
  is_verified: boolean;
  two_factor_enabled: boolean;
  two_factor_secret?: string | null;

  // Identity settings
  is_active: boolean;
  is_locked: boolean;
  failed_attempts: number;
  settings: Record<string, any>;

  created_at: Date;
  updated_at: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  static create(props: Partial<UserProps>): User {
    return new User({
      id: undefined,
      username: props.username!,
      fullname: props.fullname!,
      email: props.email!,
      password: props.password!,
      provider: props.provider!,
      role: props.role!,
      phone_number: props.phone_number ?? null,
      avatar_url: props.avatar_url ?? null,
      is_verified: false,
      two_factor_enabled: false,
      two_factor_secret: null,
      is_active: true,
      is_locked: false,
      failed_attempts: 0,
      settings: {},
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  get id() {
    return this.props.id;
  }
  get username() {
    return this.props.username;
  }
  get fullname() {
    return this.props.fullname;
  }
  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }
  get phone_number() {
    return this.props.phone_number ?? null;
  }
  get avatar_url() {
    return this.props.avatar_url ?? null;
  }
  get provider() {
    return this.props.provider;
  }
  get role() {
    return this.props.role;
  }

  get is_verified() {
    return this.props.is_verified;
  }
  get two_factor_enabled() {
    return this.props.two_factor_enabled;
  }
  get two_factor_secret() {
    return this.props.two_factor_secret ?? null;
  }

  get is_active() {
    return this.props.is_active;
  }

  get is_locked() {
    return this.props.is_locked;
  }

  get failed_attempts() {
    return this.props.failed_attempts;
  }

  get settings() {
    return this.props.settings;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  enableMfa(secret: string) {
    return new User({
      ...this.props,
      two_factor_secret: secret,
      two_factor_enabled: true,
    });
  }

  update(fields: Partial<UserProps>) {
    return new User({
      ...this.props,
      ...fields,
      updated_at: new Date(),
    });
  }

  lockAccount() {
    return this.update({
      is_locked: true,
      failed_attempts: 0,
    });
  }

  unlockAccount() {
    return this.update({ is_locked: false });
  }

  incrementFailedAttempts() {
    const attempts = this.props.failed_attempts + 1;
    const shouldLock = attempts >= 5;
    return this.update({
      failed_attempts: attempts,
      is_locked: shouldLock,
    });
  }

  getProps() {
    return this.props;
  }
}
