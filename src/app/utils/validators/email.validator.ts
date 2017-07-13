import { AbstractControl } from '@angular/forms';
/**
 * This is an input validator
 */
export class EmailValidator {
	public static validate(c: AbstractControl) {
		let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

		return EMAIL_REGEXP.test(c.value)
			? null
			: {
					validateEmail: {
						valid: false,
						message: 'Please provide a valid email',
					},
				};
	}
}
