import {localisedDigits} from '../services/localisedDigits';
import { useState } from 'react';
import { useAppSelector } from '../../App';

// Define type for supported languages and their digit mappings
type DigitLanguage = 'bn' | 'hin' | 'urd' | 'ar' | 'tr' | 'en';

const useDigitConverter = (): {
    language: DigitLanguage;
    setLanguage: React.Dispatch<React.SetStateAction<DigitLanguage>>;
    convertDigits: (inputString: any) => string;
} => {

    const locale = useAppSelector((state: any) =>
        state.selectedCountry?.locale,
    );
    const [language, setLanguage] = useState<DigitLanguage>('en'); // Default language is English

    const convertDigits = (inputString: any): string => localisedDigits(inputString, locale);

    return {
        language,
        setLanguage,
        convertDigits,
    };
};

export default useDigitConverter;
