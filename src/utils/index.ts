export function restSuccess(data: any) {
    return {
        success: true,
        data
    }
}

export function restError(message: string, details: any) {
    return {
        success: false,
        message,
        details
    }
}