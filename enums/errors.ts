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
export class NicknameInUse extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export const ErrorEnums = {
  unauthorized: "UNAUTHORIZED",
  no_role_access: "NO_ROLE_ACCESS",
  no_public_access: "NO_PUBLIC_ACCESS",
  nickname_in_use: "NICKNAME_IN_USE",
};
