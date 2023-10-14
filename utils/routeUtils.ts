import { AllEntities } from "../enums/entityEnums";

export function getEntityFromRoute(route: string): string | false {
  for (let index = 0; index < AllEntities.length; index++) {
    if (route.includes(AllEntities[index])) return AllEntities[index];
  }
  return false;
}
