export const recaptchaV3TypeDefs = /* GraphQL */ `
    """
    recaptcha token must be specified in 'recaptcha' header
    it also must match 'actionName'
    """
    directive @recaptchaV3(actionName: String!) on FIELD_DEFINITION
`;
