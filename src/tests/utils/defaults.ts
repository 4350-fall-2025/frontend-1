import { defaultDate, todayDate } from "~data/constants";
import dayjs from "dayjs";

/**
 * Default values for signup form fields generated with GPT-5 mini
 */
export const DEFAULT_FIRST_NAME = "John Jacob";
export const DEFAULT_LAST_NAME = "Jingleheimer schmidt";
export const DEFAULT_EMAIL = "jjjs@gmail.com";
export const DEFAULT_PASSWORD = "Password1!";
export const DEFAULT_LICENSE_ID = "A12345";
export const DEFAULT_PROVINCE = "MB";

/**
 * Default values for new pet form fields generated with GPT-5 mini
 */
export const DEFAULT_NAME = DEFAULT_FIRST_NAME;
export const DEFAULT_ANIMAL_GROUP = "Bird";
export const DEFAULT_SEX = "Male";
export const DEFAULT_SPAYED_OR_NEUTERED = "Yes";
export const DEFAULT_SPECIES = "Parrot";
export const DEFAULT_BREED_OR_VARIETY = "Macaw";
export const DEFAULT_BIRTH_DATE = dayjs(todayDate).format("MMMM D, YYYY");
