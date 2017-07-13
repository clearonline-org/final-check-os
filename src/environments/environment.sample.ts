// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	stubBackend: true,

	region: '', // ex: us-east-1
	identityPoolId: '', // ex: us-east-1:sadsad-asdsadsa-asdasd-asdsad
	userPoolId: '', // ex: us-east-1:WEDSFDSF
	appClientId: '', // ex: sddsfsdfdsfsdf

	// START backend
	HTTP_LOGGING_SERVER: 'https://host-url',
	REGISTRATION_API: 'https://host-url/register-application',
	REGISTRATION_LISTING_API: 'https://host-url/list-applications',
	LOG_REQUEST_API: 'https://host-url/log-request',
	LOG_LISTING_API: 'https://host-url/list-requests',
	LOG_SUMMARY_API: 'https://host-url/log-summary-all-status',
};
