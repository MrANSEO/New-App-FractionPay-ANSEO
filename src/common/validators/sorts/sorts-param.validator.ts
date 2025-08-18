import { ValidatorConstraint, ValidatorConstraintInterface, isObject } from 'class-validator';

@ValidatorConstraint({ name: 'sorts', async: false })
export class SortsParamValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    try {
      const parsed: unknown = JSON.parse(value);
      if (isObject(parsed) && !Array.isArray(parsed)) {
        return Object.values(parsed).every((item) => item === 1 || item === -1);
      }

      return false;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return '($value) should be a JSON text with the shape: { "property": -1 | 1 }';
  }
}
