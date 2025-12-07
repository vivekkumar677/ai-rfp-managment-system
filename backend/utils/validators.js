export const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isNonEmptyString = (str) => typeof str === "string" && str.trim().length > 0;