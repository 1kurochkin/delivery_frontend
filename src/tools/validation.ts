export const validation = (field: string, value: any) => {
    let result = false;
    switch (field) {
        case 'phone': result = true; break;
        default: result = false
    }
    return {field, isValid: result};
}