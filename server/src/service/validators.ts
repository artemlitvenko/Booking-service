import { maxEmailLength } from './validationConstants';
import { maxLength, maxPasswordLength, maxRatingLength, maxSizeLength, minLength, minRatingLength, minSizeLength } from './validationConstants';

import { check } from 'express-validator';

export const registerValidators = [
    check('email', 'Uncorrect email').isEmail().trim(),
    check('password', `Password must be longer than ${minLength} and shorter than ${maxPasswordLength}`).isLength({
        min: minLength,
        max: maxPasswordLength,
    }),
];

export const loginValidators = [
    check('email', 'Uncorrect email').isEmail().isLength({ min: minLength, max: maxEmailLength }).trim(),
    check('password', `Password must be longer than ${minLength} and shorter than ${maxPasswordLength}`).isLength({
        min: minLength,
        max: maxPasswordLength,
    }),
];

export const cityValidators = [
    check('city_name', `Name must be longer than ${minLength} and shorter than ${maxLength}`).isLength({ min: minLength, max: maxLength }).trim(),
];

export const masterEditValidators = [
    check('name', `Name must be longer than ${minLength} and shorter than ${maxLength}`).isLength({ min: minLength, max: maxLength }).trim(),
    check('rating', `Rating must be a number between ${minRatingLength} and ${maxRatingLength}`).isFloat({
        min: minRatingLength,
        max: maxRatingLength,
    }),
    check('city', 'City must be MongoId').isMongoId().trim(),
    check('id', 'Id must be MongoId').isMongoId().trim(),
];
export const masterPostValidators = [
    check('name', `Name must be longer than ${minLength} and shorter than ${maxLength}`).isLength({ min: minLength, max: maxLength }).trim(),
    check('rating', `Rating must be a number between ${minRatingLength} and ${maxRatingLength}`).isFloat({
        min: minRatingLength,
        max: maxRatingLength,
    }),
    check('city', 'City must be MongoId').isMongoId().trim(),
];
export const masterDeleteValidators = [check('id', 'Id must be MongoId').isMongoId().trim()];

export const orderValidators = [
    check('client_name', `Name must be longer than ${minLength} and shorter than ${maxLength}`).isLength({ min: minLength, max: maxLength }).trim(),
    check('client_email', 'Uncorrect email').isEmail().isLength({ min: minLength, max: maxEmailLength }).trim(),
    check('master', 'Master must be MongoId').isMongoId().trim(),
    check('city', 'City must be MongoId').isMongoId().trim(),
    check('size', 'Size must be Number').isFloat({ min: minSizeLength, max: maxSizeLength }),
    check('start_time', 'Start time must be Date').isISO8601(),
    check('end_time', 'End time must be Date').isISO8601(),
];
