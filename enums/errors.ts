export class UnauthorizedError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
export class NoPublicAccess extends Error {
  constructor(public message: string) {
    super(message);
  }
}
export class NoRoleAccess extends Error {
  constructor(public message: string) {
    super(message);
  }
}
