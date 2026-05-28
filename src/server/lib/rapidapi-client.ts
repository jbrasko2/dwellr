import { ListingsServiceError } from '../services/listings/listings.service';

export const BASE_URL = 'https://realty-in-us.p.rapidapi.com';

let _headers: Record<string, string> | null = null;

export function getRapidApiHeaders(): Record<string, string> {
    if (!_headers) {
        const apiKey = process.env['RAPID_API_KEY'];
        if (!apiKey) {
            throw new ListingsServiceError('RAPID_API_KEY is not set');
        }
        _headers = {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'realty-in-us.p.rapidapi.com',
            'x-rapidapi-key': apiKey,
        };
    }
    return _headers;
}
