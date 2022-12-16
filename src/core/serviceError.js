const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN';
const CONFLICT = 'CONFLICT';
const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

class ServiceError extends Error {
    constructor(code, message, details = {}) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = 'ServiceError';
	}
    // Static methods
    static notFound(message, details) {
		return new ServiceError(NOT_FOUND, message, details);
	}

	static validationFailed(message, details) {
		return new ServiceError(VALIDATION_FAILED, message, details);
	}

	static unauthorized(message, details) {
		return new ServiceError(UNAUTHORIZED, message, details);
	}

	static forbidden(message, details) {
		return new ServiceError(FORBIDDEN, message, details);
	}

	static conflict(message, details) {
		return new ServiceError(CONFLICT, message, details);
	}

	static internalServerError(message, details) {
		return new ServiceError(INTERNAL_SERVER_ERROR, message, details);
	}
    // Getters
    get isNotFound() {
		return this.code === NOT_FOUND;
	}

	get isValidationFailed() {
		return this.code === VALIDATION_FAILED;
	}

	get isUnauthorized() {
		return this.code === UNAUTHORIZED;
	}

	get isForbidden() {
		return this.code === FORBIDDEN;
	}

	get isConflict() {
		return this.code === CONFLICT;
	}

	get isInternalServerError() {
		return this.code === INTERNAL_SERVER_ERROR;
	}
}

// Export
module.exports = ServiceError;
