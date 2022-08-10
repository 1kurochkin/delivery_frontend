export const validation = (field: string, value: any) => {
    let result = false;
    switch (field) {
        case 'phone': result = true; break;
        case 'name': result = true; break;
        case 'lastName': result = true; break;
        case 'birth': result = true; break;
        case 'code': result = true; break;
        case 'role': result = true; break;
        default: result = false
    }
    return {field, isValid: result};
}