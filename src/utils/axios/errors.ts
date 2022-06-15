/**
 * Base class for custom errors.
 */
export class CustomError extends Error {
    constructor(message: string) {
        super(message)
        // Set a more specific name. This will show up in e.g. console.log.
        this.name = this.constructor.name
    }
}

/**
 * Base class for a custom error which wraps another error.
 */
export class WrappedError extends CustomError {
    public readonly originalError: Error

    constructor(message: string, originalError: Error) {
        super(message)
        this.originalError = originalError
    }
}

interface AxiosOriginalError extends Error {
    isAxiosError: true
    toJSON(): Record<string, unknown>
}

interface AxiosErrorResponse {
    status: number
    statusText: string
    data: Record<string, unknown>
}

/**
 * An error thrown by axios.
 *
 * Depending on your use case, if logging errors, you may want to catch axios errors and sanitize
 * them to remove the request and response objects, or sensitive fields. For example:
 *
 *   this.originalError = _.omit(originalError.toJSON(), 'config')
 */
export class AxiosError extends WrappedError {}

/**
 * Axios error with response error fields.
 */
export class AxiosServerError extends AxiosError {
    public readonly status: number
    public readonly statusText: string
    public readonly data: Record<string, unknown>

    constructor(response: AxiosErrorResponse, originalError: AxiosOriginalError) {
        super(`${response.status}: ${response.statusText} - ${JSON.stringify(response.data, null, 2)}`, originalError)
        this.status = response.status
        this.statusText = response.statusText
        this.data = response.data
    }
}
