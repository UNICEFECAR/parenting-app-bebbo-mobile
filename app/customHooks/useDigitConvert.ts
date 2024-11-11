import { retry } from '@redux-saga/core/effects';
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
    // Define digit mappings for different languages
    const digitMap: Record<DigitLanguage, string[]> = {
        'bn': ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
        'hin': ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
        'urd': ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
        'ar': ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
        'tr': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        'en': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], // Turkish uses Latin digits
        // Add more languages and their digit mappings as needed
    };

    const [language, setLanguage] = useState<DigitLanguage>('bn'); // Default language is Bangla
    
    const convertDigits = (inputString: any): string => {
        if(!inputString) return ''
        // Convert input string to lowercase for case-insensitive comparison
        const lowerTarget = locale?.toLowerCase?.() as DigitLanguage;

        // Check if the target language is supported
        if (!digitMap[lowerTarget]) {
            console.log('Unsupported language');
            return inputString;
        } 

        // Get the digit array for the target language
        const targetDigits = digitMap[lowerTarget];

        // Replace digits in the input string
        let result = '';
        for (let char of inputString.toString?.()) {
            // Check if the character is a digit (0-9)
            if (/[0-9]/.test(char)) {
                // Find the corresponding digit in the target language
                const index = parseInt(char); // Convert character to integer
                result += targetDigits[index];
            } else {
                // If the character is not a digit, keep it unchanged
                result += char;
            }
        }

        return result;
    };

    return {
        language,
        setLanguage,
        convertDigits,
    };
};

export default useDigitConverter;
